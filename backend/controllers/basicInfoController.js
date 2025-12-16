import supabase from '../config/supabase.js';
import { validationResult } from 'express-validator';

// Helper function untuk cek kepemilikan CV (Security Check)
const checkCvOwnership = async (cvId, userId) => {
    const { data } = await supabase
        .from('cvs')
        .select('id')
        .eq('id', cvId)
        .eq('user_id', userId)
        .single();
    return !!data; // Return true jika CV milik user, false jika bukan
};

export const getCvBasicInfoById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cvId } = req.params;

        // 1. Cek Security: Pastikan CV milik user yang login
        const isOwner = await checkCvOwnership(cvId, userId);
        if (!isOwner) {
            return res.status(404).json({ message: 'CV not found or access denied' });
        }

        // 2. Ambil data Basic Info (Tanpa filter user_id lagi, cukup cv_id)
        const { data, error } = await supabase
            .from('cv_basic_info')
            .select('*')
            .eq('cv_id', cvId)
            .single();
        
        // Jika belum diisi, kembalikan null (bukan error 404, karena CV-nya ada)
        if (!data) {
            return res.status(200).json({ data: null });
        }

        return res.status(200).json({ data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// FUNGSI INI MENGGABUNGKAN INSERT & UPDATE (UPSERT)
// Ini menyelesaikan masalah Logic "One-to-One Issue"
export const upsertCvBasicInfo = async (req, res) => {
    // 1. Cek Validation Result (Masalah Validasi D)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = req.user.id;
        const { cvId } = req.params;
        const { 
            phone_number, linkedin_url, github_url, address, 
            city, province, country, postal_code, date_of_birth, profile_summary 
        } = req.body;

        // 2. Cek Security: Pastikan CV milik user sebelum edit
        const isOwner = await checkCvOwnership(cvId, userId);
        if (!isOwner) {
            return res.status(404).json({ message: 'CV not found or access denied' });
        }

        // 3. Lakukan UPSERT (Update jika ada, Insert jika belum)
        // Kita tidak memasukkan user_id lagi ke sini (Fix A)
        const { data, error } = await supabase
            .from('cv_basic_info')
            .upsert({
                cv_id: cvId,
                phone_number,
                linkedin_url,
                github_url,
                address,
                city,
                province,
                country,
                postal_code,
                date_of_birth,
                profile_summary,
                updated_at: new Date()
            }, { onConflict: 'cv_id' }) // Kunci Upsert ada di sini (Fix B)
            .select()
            .single();

        if (error) throw error;

        return res.status(200).json({
            message: 'Basic info saved successfully',
            data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};