import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Function to create JWT token for authenticated users
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d', // Token expires in 30 days
  });
};

// Handle user registration
router.post('/register', async (req, res) => {
  try {
    console.log('New user trying to register:', req.body);
    
    const { name, email, password } = req.body;

    // Check if email already exists in database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }

    // Create new user in database
    const user = await User.create({
      name,
      email,
      password,
    });

    console.log('User successfully created:', user.email);

    // Create authentication token for new user
    const token = generateToken(user._id);

    // Send success response with user data and token
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      token: token, // This token will be used for future requests
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ 
      success: false,
      message: 'Database error during registration',
      error: error.message 
    });
  }
});

// Handle user login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Create authentication token
      const token = generateToken(user._id);

      // Send success response
      res.json({
        success: true,
        message: 'Login successful!',
        token: token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          profile: user.profile
        }
      });
    } else {
      // Invalid credentials
      res.status(401).json({
        success: false, 
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    // Server error
    res.status(500).json({
      success: false,
      message: 'Database error during login'
    });
  }
});

// Get current user's profile (requires authentication)
router.get('/profile', async (req, res) => {
  try {
    // Get token from request header
    const token = req.headers.authorization?.split(' ')[1];
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from token, exclude password field
    const user = await User.findById(decoded.id).select('-password');
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return user profile data
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile
      }
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    
    // Handle different types of token errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    // General server error
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

export default router;