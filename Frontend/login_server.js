import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// ES modules don't have __dirname, so we create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config();

// Create a backup .env file if it doesn't exist
const envPath = path.resolve(__dirname, '.env');
console.log(`Looking for .env file at: ${envPath}`);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log environment variables (for debugging)
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not set');

// Connect to MongoDB with fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stockapp';

// If we're still not getting the MongoDB URI from the environment, use this hardcoded one
if (!process.env.MONGODB_URI) {
  console.log('Using hardcoded MongoDB URI as fallback');
  mongoose.connect('mongodb+srv://syedalihussain2107:y2j%2Fsucks@stockdb.naacu.mongodb.net/?retryWrites=true&w=majority&appName=stockdb')
    .then(() => console.log('Connected to MongoDB using hardcoded URI'))
    .catch(err => console.error('MongoDB connection error with hardcoded URI:', err));
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// User Schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Register route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });
    
    await newUser.save();
    
    // Generate JWT
    const token = jwt.sign(
      { userId: newUser._id }, 
      process.env.JWT_SECRET || 'fallback_secret_key_for_development',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      token,
      userId: newUser._id
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret_key_for_development',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      userId: user._id,
      fullName: user.fullName
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Simple test route
app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth server is running' });
});

// Debug route to see all environment variables
app.get('/api/debug/env', (req, res) => {
  res.json({
    MONGODB_URI: process.env.MONGODB_URI || 'Not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'Set (hidden)' : 'Not set',
    PORT: process.env.PORT || 'Not set'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));