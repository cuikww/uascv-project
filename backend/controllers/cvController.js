import supabase from '../config/supabase.js';
import { LINK_TABLE_MAP, TABLE_MAP } from '../utils/helpers.js';

export const getCvFullContent = async (req, res) => {
    const { cvId } = req.params;
    const userId = req.user.id;

    try {
        // A. Ambil Info Dasar CV (Pastikan milik user)
        const { data: cv, error: cvError } = await supabase
            .from('cvs')
            .select('*')
            .eq('id', cvId)
            .eq('user_id', userId)
            .single();

        if (cvError || !cv) return res.status(404).json({ message: "CV not found" });

        // B. Ambil Master Data yang TERHUBUNG ke CV ini
        // Menggunakan teknik Inner Join via Link Table
        const { data: educations } = await supabase
            .from('master_educations')
            .select('*, cv_education_links!inner(cv_id)')
            .eq('cv_education_links.cv_id', cvId)
            .order('start_date', { ascending: false });

        const { data: experiences } = await supabase
            .from('master_experiences')
            .select('*, cv_experience_links!inner(cv_id)')
            .eq('cv_experience_links.cv_id', cvId)
            .order('start_date', { ascending: false });

        const { data: skills } = await supabase
            .from('master_skills')
            .select('*, cv_skill_links!inner(cv_id)')
            .eq('cv_skill_links.cv_id', cvId);

        res.json({ 
            cv_info: cv, 
            sections: { educations, experiences, skills } 
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const toggleItemInCv = async (req, res) => {
    const { cvId } = req.params;
    const { section, itemId } = req.body;
    const userId = req.user.id;

    const linkConfig = LINK_TABLE_MAP[section];
    if (!linkConfig) return res.status(400).json({ message: "Invalid section" });

    try {
        // Validasi: Pastikan CV milik user
        const { data: cv } = await supabase.from('cvs').select('id').eq('id', cvId).eq('user_id', userId).single();
        if (!cv) return res.status(403).json({ message: "Access denied to this CV" });

        // Cek apakah item sudah ada di CV ini?
        const { data: exists, error } = await supabase
            .from(linkConfig.table)
            .select('*')
            .eq('cv_id', cvId)
            .eq(linkConfig.fk_master, itemId)
            .single();

        if (exists) {
            // JIKA ADA -> HAPUS (Unlink)
            await supabase
                .from(linkConfig.table)
                .delete()
                .eq('cv_id', cvId)
                .eq(linkConfig.fk_master, itemId);
            
            res.json({ message: "Item removed from CV", status: 'removed' });
        } else {
            // JIKA TIDAK ADA -> TAMBAH (Link)
            await supabase
                .from(linkConfig.table)
                .insert([{ cv_id: cvId, [linkConfig.fk_master]: itemId }]);
                
            res.json({ message: "Item added to CV", status: 'added' });
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createCv = async (req, res) => {
    const userId = req.user.id;
    try {
        const { data, error } = await supabase
            .from('cvs')
            .insert([{ 
                user_id: userId, 
                title: req.body.title || 'Untitled CV',
                template: 'modern' 
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ message: "CV Created", data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getAllCvs = async (req, res) => {
    const userId = req.user.id;

    try {
        const { data, error } = await supabase
            .from('cvs')
            .select('*')
            .eq('user_id', userId) // Security: Cuma ambil punya user sendiri
            .order('updated_at', { ascending: false }); // Yang baru diedit paling atas

        if (error) throw error;
        res.json({ data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateCv = async (req, res) => {
    const { cvId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    try {
        // 1. Sanitasi: Cegah user mengubah ID atau Owner secara paksa
        delete updates.id;
        delete updates.user_id;
        delete updates.created_at;

        // 2. Tambahkan timestamp update
        updates.updated_at = new Date();

        // 3. Update ke Database
        const { data, error } = await supabase
            .from('cvs')
            .update(updates)
            .eq('id', cvId)
            .eq('user_id', userId) // Security: Pastikan update punya sendiri
            .select()
            .single();

        if (error) throw error;
        
        // Jika data kosong, berarti CV tidak ditemukan atau bukan milik user ini
        if (!data) return res.status(404).json({ message: "CV tidak ditemukan atau akses ditolak" });

        res.json({ message: "CV berhasil diperbarui", data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const deleteCv = async (req, res) => {
    const { cvId } = req.params;
    const userId = req.user.id;

    try {
        const { error, count } = await supabase
            .from('cvs')
            .delete({ count: 'exact' }) // Minta info jumlah baris yang dihapus
            .eq('id', cvId)
            .eq('user_id', userId); // Security: Cuma bisa hapus punya sendiri

        if (error) throw error;

        // Jika count 0, artinya ID tidak ditemukan atau bukan milik user
        if (count === 0) {
            return res.status(404).json({ message: "CV tidak ditemukan atau akses ditolak" });
        }

        res.json({ message: "CV berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};