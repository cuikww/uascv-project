import { body, param } from 'express-validator';

export const validateSection = (method) => {
    const common = [
        param('section').isIn(['educations', 'experiences', 'skills']).withMessage('Invalid section type')
    ];

    switch (method) {
        case 'add':
            return [
                ...common,
                body('start_date').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid start date'),
                body('end_date').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid end date'),
                body('institution').if(param('section').equals('educations')).notEmpty().withMessage('Institution required'),
                body('company').if(param('section').equals('experiences')).notEmpty().withMessage('Company required'),
                body('position').if(param('section').equals('experiences')).notEmpty().withMessage('Position required'),
                body('skill_name').if(param('section').equals('skills')).notEmpty().withMessage('Skill name required'),
                body('level').if(param('section').equals('skills')).isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']).withMessage('Invalid level'),
            ];
        case 'update':
            return [
                ...common,
                body('start_date').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid start date'),
                body('end_date').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid end date'),
                body('institution').if(param('section').equals('educations')).optional().notEmpty().withMessage('Institution cannot be empty'),
                body('company').if(param('section').equals('experiences')).optional().notEmpty().withMessage('Company cannot be empty'),
                body('position').if(param('section').equals('experiences')).optional().notEmpty().withMessage('Position cannot be empty'),
                body('skill_name').if(param('section').equals('skills')).optional().notEmpty().withMessage('Skill name cannot be empty'),
                body('level').if(param('section').equals('skills')).optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']).withMessage('Invalid level'),
            ];
        default:
            return common;
    }
};