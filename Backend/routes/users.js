import express from 'express';
const router = express.Router();

// Handle user profile updates
router.put('/profile', (req, res) => {
  // This endpoint handles updating user profile information
  // For now, it just returns a success message with the received data
  res.json({
    success: true,
    message: 'Update profile endpoint working!',
    user: req.body  // Return the user data that was sent in the request
  });
});

export default router;