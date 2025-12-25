import supabase from '../config/supabase.js';

// Get all job applications for user
export const getAllJobApplications = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const { data, error } = await supabase
            .from('job_applications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get job applications grouped by status
export const getJobApplicationsByStatus = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const statuses = ['wishlist', 'applied', 'interview', 'offer'];
        const result = {};
        
        for (const status of statuses) {
            const { data, error } = await supabase
                .from('job_applications')
                .select('*')
                .eq('user_id', userId)
                .eq('status', status)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            result[status] = data || [];
        }
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single job application
export const getJobApplication = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    
    try {
        const { data, error } = await supabase
            .from('job_applications')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        
        if (error || !data) return res.status(404).json({ message: "Job application not found" });
        
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create new job application
export const createJobApplication = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        const {
            company_name,
            position_title,
            status = 'wishlist',
            cv_id,
            job_description,
            job_url,
            applied_date,
            interview_date,
            interview_location,
            interview_type,
            company_location,
            work_mode,
            salary_range,
            job_type,
            notes,
            difficulty_level
        } = req.body;
        
        // Validasi required fields
        if (!company_name || !position_title) {
            return res.status(400).json({ message: "Company name and position title are required" });
        }

        const { data, error } = await supabase
            .from('job_applications')
            .insert([{
                user_id: userId,
                company_name,
                position_title,
                status,
                cv_id: cv_id || null,
                job_description: job_description || null,
                job_url: job_url || null,
                applied_date: applied_date || null,
                interview_date: interview_date || null,
                interview_location: interview_location || null,
                interview_type: interview_type || null,
                company_location: company_location || null,
                work_mode: work_mode || null,
                salary_range: salary_range || null,
                job_type: job_type || null,
                notes: notes || null,
                difficulty_level: difficulty_level || 'medium'
            }])
            .select();
        
        if (error) throw error;
        
        res.status(201).json(data[0]);
    } catch (err) {
        console.error('Create job error:', err);
        res.status(500).json({ message: err.message || 'Failed to create application' });
    }
};

// Update job application
export const updateJobApplication = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    let updates = req.body;
    
    try {
        // Verify ownership
        const { data: existing } = await supabase
            .from('job_applications')
            .select('id')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        
        if (!existing) return res.status(403).json({ message: "Access denied" });
        
        // Convert empty strings to null for date/optional fields
        updates = Object.keys(updates).reduce((acc, key) => {
            acc[key] = (updates[key] === '' || updates[key] === undefined) ? null : updates[key];
            return acc;
        }, {});
        
        // Add updated_at
        updates.updated_at = new Date();
        
        const { data, error } = await supabase
            .from('job_applications')
            .update(updates)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        
        res.json(data[0]);
    } catch (err) {
        console.error('Update job error:', err);
        res.status(500).json({ message: err.message || 'Failed to update application' });
    }
};

// Change job application status
export const updateJobApplicationStatus = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['wishlist', 'applied', 'interview', 'offer'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }
    
    try {
        // Verify ownership
        const { data: existing } = await supabase
            .from('job_applications')
            .select('status')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        
        if (!existing) return res.status(403).json({ message: "Access denied" });
        
        // Update status
        const { data, error } = await supabase
            .from('job_applications')
            .update({ 
                status,
                updated_at: new Date(),
                applied_date: status === 'applied' ? new Date().toISOString().split('T')[0] : undefined
            })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        
        // Log history
        try {
            await supabase
                .from('job_application_history')
                .insert([{
                    job_application_id: id,
                    old_status: existing.status,
                    new_status: status
                }]);
        } catch (historyErr) {
            console.log('History logging failed:', historyErr);
        }
        
        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete job application
export const deleteJobApplication = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    
    try {
        // Verify ownership
        const { data: existing } = await supabase
            .from('job_applications')
            .select('id')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        
        if (!existing) return res.status(403).json({ message: "Access denied" });
        
        // Delete (cascade will handle history)
        const { error } = await supabase
            .from('job_applications')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        res.json({ message: "Job application deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get statistics for dashboard
export const getJobApplicationStats = async (req, res) => {
    const userId = req.user.id;
    
    try {
        // Get counts by status
        const { data: stats } = await supabase
            .from('job_applications')
            .select('status')
            .eq('user_id', userId);
        
        const counts = {
            wishlist: 0,
            applied: 0,
            interview: 0,
            offer: 0,
            total: 0
        };
        
        stats?.forEach(app => {
            counts[app.status]++;
            counts.total++;
        });
        
        res.json(counts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
