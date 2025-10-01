import mongoose from 'mongoose';

// Define the structure for tasks in our database
const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,  // Every task must have a title
      trim: true       // Remove extra spaces from title
    },
    description: {
      type: String,
      default: ''      // Description is optional, empty by default
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],  // Only these status values allowed
      default: 'pending'  // New tasks start as pending
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],  // Only these priority levels allowed
      default: 'medium'  // Default priority is medium
    },
    dueDate: {
      type: Date        // Optional due date for the task
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,   // Every task must belong to a user
      ref: 'User'       // Reference to the User model
    }
  },
  {
    timestamps: true    // Automatically add createdAt and updatedAt fields
  }
);

// Create the Task model from our schema
const Task = mongoose.model('Task', taskSchema);

export default Task;