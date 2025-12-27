import supabase from '../config/supabase.js';

export const getProfile = async (req, res) => {
    const userId = req.user.id; 

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error && error.code !== 'PGRST116') { 
            throw error;
        }

        res.json({ data: data || {} });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const saveProfile = async (req, res) => {
    const userId = req.user.id;
    const payload = req.body;

    try {
        delete payload.id;
        delete payload.created_at;

        const { data, error } = await supabase
            .from('profiles')
            .upsert({ ...payload, user_id: userId }, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;
        res.json({ message: "Profil berhasil disimpan", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Gagal menyimpan profil" });
    }
};