import supabase from '../config/supabase.js';
import { validationResult } from 'express-validator';

export const getCvBasicInfoById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cvId } = req.params;

        const { data, error } = await supabase
            .from('cv_basic_info')
            .select('*')
            .eq('cv_id', cvId)
            .eq('user_id', userId)
            .single();
        
        if (error || !data) {
            return res.status(404).json({
                message: 'CV not found'
            })
        }

        return res.status(200).json({
            data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

export const insertCvBasicInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cvId } = req.params;
        const { phone_number, linkedin_url, github_url, address, city, province, country, postal_code, date_of_birth, profile_summary } = req.body;

        const template = 'default';

        // 4. insert CV
        const { data: cv_basic_info, error } = await supabase
            .from('cv_basic_info')
            .insert({
                cv_id: cvId,
                user_id: userId,
                phone_number,
                linkedin_url,
                github_url,
                address,
                city,
                province,
                country,
                postal_code,
                date_of_birth,
                profile_summary
            })
            .select()
            .single();

        if (error) throw error;

        return res.status(201).json({
            message: 'Basic info created',
            basicId: cv_basic_info.id
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

export const updateCvBasicInfo = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cvId, basicId } = req.params;
        const { phone_number, linkedin_url, github_url, address, city, province, country, postal_code, date_of_birth, profile_summary } = req.body;

        const { data: basic_info, error: cvError } = await supabase
            .from('cv_basic_info')
            .select('id')
            .eq('id', basicId)
            .eq('cv_id', cvId)
            .eq('user_id', userId)
            .single();
        
        if (!basic_info) return res.status(404).json({ message: "CV not found" });

        // Update
        const { data, error } = await supabase
            .from('cv_basic_info')
            .update({
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
            })
            .eq('id', basicId)
            .select()
            .single();
        
        if (error) throw error;

        return res.status(200).json({
            message: "Basic info updated",
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}