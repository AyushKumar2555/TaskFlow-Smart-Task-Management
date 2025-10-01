import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import route files
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import userRoutes from './routes/users.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Register API routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/tasks', taskRoutes); // Task management routes
app.use('/api/users', userRoutes); // User profile routes

// Health check endpoint to verify server is running
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Main API information endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TaskFlow Backend API - Intern Assignment',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      tasks: {
        get: 'GET /api/tasks',
        create: 'POST /api/tasks',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id'
      },
      users: {
        update: 'PUT /api/users/profile'
      }
    }
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// Handle 404 routes - when no endpoint matches
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Database connection and server startup
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/frontend-intern';
const PORT = process.env.PORT || 5000;

// Connect to MongoDB database
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.db?.databaseName);
    
    // Start the server only after successful database connection
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`API Base: http://localhost:${PORT}/`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    console.log('Please make sure:');
    console.log('  1. MongoDB is running on your system');
    console.log('  2. The connection string in .env is correct');
    console.log('  3. No other app is using the same database');
    process.exit(1);
  });

export default app;