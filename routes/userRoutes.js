const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Register a new user (for initial setup, later add admin check)
router.post('/register', async (req, res) => {
  try {
    const { username, password, permissions, roles } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const newUser = new User({ username, password, permissions, roles }); // لا توجد تجزئة لكلمة المرور حاليا (هش)
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: { username: newUser.username, permissions: newUser.permissions } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password }); // لا توجد تجزئة لكلمة المرور حاليا
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    // في تطبيق حقيقي، ستولد JWT هنا
    res.status(200).json({ message: 'Login successful', user: { username: user.username, permissions: user.permissions, roles: user.roles } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (should be admin protected)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // لا ترسل كلمات المرور
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a user (should be admin protected)
router.put('/:id', async (req, res) => {
  try {
    const { username, password, permissions, roles } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { username, password, permissions, roles }, { new: true });
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a user (should be admin protected)
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;