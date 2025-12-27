import supabase from '../config/supabase.js';
import { validationResult } from 'express-validator';
import { TABLE_MAP, sanitizePayload, isValidUUID } from '../utils/helpers.js';

export const getMasterData = async (req, res) => {
    const { section } = req.params;
    const userId = req.user.id; 
    const table = TABLE_MAP[section];

    if (!table) return res.status(400).json({ message: "Invalid section" });

    try {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('user_id', userId) 
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addMasterData = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { section } = req.params;
    const userId = req.user.id;
    const table = TABLE_MAP[section];

    const payload = sanitizePayload(req.body);

    try {
        const { data, error } = await supabase
            .from(table)
            .insert([{ ...payload, user_id: userId }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ message: "Item Saved", data });
    } catch (err) {
        console.error("DB Error:", err);
        res.status(500).json({ message: "Database error", detail: err.message });
    }
};

export const updateMasterData = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { section, id } = req.params;
    const userId = req.user.id;
    const table = TABLE_MAP[section];
    const payload = sanitizePayload(req.body);

    if (!isValidUUID(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const { data, error } = await supabase
            .from(table)
            .update(payload)
            .eq('id', id)
            .eq('user_id', userId) 
            .select()
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ message: "Item not found or access denied" });

        res.json({ message: "Item Updated", data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteMasterData = async (req, res) => {
    const { section, id } = req.params;
    const userId = req.user.id;
    const table = TABLE_MAP[section];

    if (!isValidUUID(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    try {
        const { error, count } = await supabase
            .from(table)
            .delete({ count: 'exact' })
            .eq('id', id)
            .eq('user_id', userId); 

        if (error) throw error;
        if (count === 0) return res.status(404).json({ message: "Item not found or access denied" });

        res.json({ message: "Item Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};