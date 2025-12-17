import { body } from 'express-validator';

export const saveProfileValidator = [
    body('fullname').optional({ checkFalsy: true }).isLength({ max: 255 }).withMessage('fullname too long'),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email'),
    body('phone_number').optional({ checkFalsy: true }).isLength({ max: 32 }).withMessage('Invalid phone number'),
    body('address').optional({ checkFalsy: true }).isLength({ max: 500 }).withMessage('Address too long'),
    body('city').optional({ checkFalsy: true }).isLength({ max: 128 }).withMessage('City too long'),
    body('province').optional({ checkFalsy: true }).isLength({ max: 128 }).withMessage('Province too long'),
    body('country').optional({ checkFalsy: true }).isLength({ max: 128 }).withMessage('Country too long'),
    body('postal_code').optional({ checkFalsy: true }).isLength({ max: 32 }).withMessage('Invalid postal code'),
    body('profile_summary').optional({ checkFalsy: true }).isLength({ max: 2000 }).withMessage('Profile summary too long'),
    body('linkedin_url').optional({ checkFalsy: true }).isURL().withMessage('Invalid LinkedIn URL'),
    body('github_url').optional({ checkFalsy: true }).isURL().withMessage('Invalid GitHub URL'),
    body('website_url').optional({ checkFalsy: true }).isURL().withMessage('Invalid website URL'),
];
