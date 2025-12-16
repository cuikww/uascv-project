import { body } from 'express-validator';

export const basicInfoValidator = [
    body('phone_number')
        .optional()
        .isLength({ max: 20 }).withMessage('Phone number too long'),
    
    body('linkedin_url')
        .optional()
        .isURL().withMessage('Must be a valid URL'),

    body('github_url')
        .optional()
        .isURL().withMessage('Must be a valid URL'),
    
    body('date_of_birth')
        .optional()
        .isISO8601().withMessage('Date must be in YYYY-MM-DD format'),
    
    body('profile_summary')
        .optional()
        .isLength({ max: 2000 }).withMessage('Profile summary is too long')
];