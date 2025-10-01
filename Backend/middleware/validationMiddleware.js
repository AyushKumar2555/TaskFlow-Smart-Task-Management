import { body, validationResult } from 'express-validator';

// Rules for checking user registration data
export const registerValidation = [
  // Name should not be empty
  body('name').notEmpty().withMessage('Name is required'),
  
  // Email should be valid format
  body('email').isEmail().withMessage('Valid email is required'),
  
  // Password should be at least 6 characters long
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Rules for checking user login data
export const loginValidation = [
  // Email should be valid format
  body('email').isEmail().withMessage('Valid email is required'),
  
  // Password should not be empty
  body('password').notEmpty().withMessage('Password is required')
];

// Rules for checking task data
export const taskValidation = [
  // Task title should not be empty
  body('title').notEmpty().withMessage('Title is required')
];

// Middleware to check if there are any validation errors
export const handleValidationErrors = (req, res, next) => {
  // Get all validation errors
  const errors = validationResult(req);
  
  // If there are errors, return them to the client
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  // If no errors, move to the next middleware
  next();
};