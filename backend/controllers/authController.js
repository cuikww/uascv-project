import supabase from '../config/supabase.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
    );
}

export const register = async (req, res) => {
    const { email, password, fullname } = req.body;

    if (!password || password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    try {
        const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from("users")
            .insert([{ email, password: hashed, fullname }])
            .select()
            .single();

        if (error) throw error;

        return res.status(201).json({ message: "Register success" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Wrong password" });
        }

        const token = generateToken(user);

        return res.status(200).json({
            message: "Login success",
            token,
            user: {
                id: user.id,
                email: user.email,
                fullname: user.fullname
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};