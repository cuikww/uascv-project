// Mapping URL param ke Nama Tabel Database
export const TABLE_MAP = {
    'educations': 'master_educations',
    'experiences': 'master_experiences',
    'skills': 'master_skills'
};

export const LINK_TABLE_MAP = {
    'educations': { table: 'cv_education_links', fk_master: 'education_id' },
    'experiences': { table: 'cv_experience_links', fk_master: 'experience_id' },
    'skills': { table: 'cv_skill_links', fk_master: 'skill_id' }
};

export const sanitizePayload = (body) => {
    const payload = { ...body };

    Object.keys(payload).forEach(key => {
        if (payload[key] === "" || payload[key] === "null") {
            payload[key] = null;
        }
    });

    return payload;
};