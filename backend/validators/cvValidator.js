import { body } from 'express-validator';

export const createCvValidator = [
    body('career_level')
        .isIn(['fresh_graduate', 'professional'])
        .withMessage('Invalid career kevel')
];