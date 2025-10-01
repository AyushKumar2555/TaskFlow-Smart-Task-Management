import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define what user data looks like in our database
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,  // Every user must have a name
      trim: true       // Remove extra spaces from name
    },
    email: {
      type: String,
      required: true,  // Email is mandatory
      unique: true,    // No two users can have same email
      lowercase: true  // Store email in lowercase to avoid case issues
    },
    password: {
      type: String,
      required: true,   // Password is required for security
      minlength: 6      // Password must be at least 6 characters long
    },
    profile: {
      bio: { type: String, default: '' },     // Optional bio field
      avatar: { type: String, default: '' }   // Optional profile picture
    }
  },
  {
    timestamps: true  // Automatically track when user is created and updated
  }
);

// Before saving user to database, hash the password for security
userSchema.pre('save', async function (next) {
  // Only hash password if it's being modified (not on every save)
  if (!this.isModified('password')) {
    next();
  }
  
  // Create salt for hashing (10 rounds for good security)
  const salt = await bcrypt.genSalt(10);
  // Replace plain password with hashed version
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check if entered password matches the stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create User model from our schema
const User = mongoose.model('User', userSchema);

export default User;