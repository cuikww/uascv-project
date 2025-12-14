import supabase from '../config/supabase.js';
import { validationResult } from 'express-validator';

export const getCvById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cvId } = req.params;

        const { data, error } = await supabase
            .from('cvs')
            .select('*')
            .eq('id', cvId)
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

export const getMyCvs = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from('cvs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;

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


export const createCv = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({
        message: 'Invalid input',
        errors: errors.array()
    });
    }

    try {
        const userId = req.user.id;
        const { career_level } = req.body;

        // 3. mapping template berdasarkan career level
        // const templateMap = {
        //   fresh_graduate: 'edu_first',
        //   professional: 'exp_first'
        // };

        // const template = templateMap[career_level];
        const template = 'default';

        // 4. insert CV
        const { data: cv, error } = await supabase
            .from('cvs')
            .insert({
                user_id: userId,
                career_level,
                template
            })
            .select()
            .single();

        if (error) throw error;

        // 5. auto create section default
        // const sectionsByCareer = {
        //   fresh_graduate: [
        //     { section_type: 'basic_info', position: 1 },
        //     { section_type: 'education', position: 2 },
        //     { section_type: 'skills', position: 3 },
        //     { section_type: 'projects', position: 4 }
        //   ],
        //   professional: [
        //     { section_type: 'basic_info', position: 1 },
        //     { section_type: 'experience', position: 2 },
        //     { section_type: 'projects', position: 3 },
        //     { section_type: 'skills', position: 4 }
        //   ]
        // };

        // const sections = sectionsByCareer[career_level]
        //   .map(s => ({
        //     cv_id: cv.id,
        //     ...s
        //   }));

        // await supabase
        //   .from('cv_sections')
        //   .insert(sections);

        // 6. response
        return res.status(201).json({
            message: 'CV created',
            cv_id: cv.id
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

export const updateCv = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cvId } = req.params;
        const { title, template, status } = req.body;

        const { data: cv, error: cvError } = await supabase
            .from('cvs')
            .select('id')
            .eq('id', cvId)
            .eq('user_id', userId)
            .single();
        
        if (!cv) return res.status(404).json({ message: "CV not found" });

        // Update
        const { data, error } = await supabase
            .from('cvs')
            .update({
                title,
                template,
                status,
                updated_at: new Date()
            })
            .eq('id', cvId)
            .select()
            .single();
        
        if (error) throw error;

        return res.status(200).json({
            message: "CV updated",
            data
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

export const deleteCv = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cvId } = req.params;

        const { error } = await supabase
            .from('cvs')
            .delete()
            .eq('id', cvId)
            .eq('user_id', userId);
        
        if (error) throw error

        return res.status(200).json({
            message: 'CV deleted'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}