const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'user') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;
    const requesterRole = req.user.role;

    if (requesterRole === 'user') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (role === 'admin' && requesterRole !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can create admins' });
    }

    if (role === 'superadmin') {
      return res.status(403).json({ message: 'Cannot create superadmin' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role, status });
    await user.save();

    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, status: user.status });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const requesterRole = req.user.role;
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.role === 'superadmin') {
      return res.status(403).json({ message: 'Cannot modify superadmin' });
    }

    if (requesterRole === 'user') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (role === 'admin' && requesterRole !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can assign admin role' });
    }

    if (role === 'superadmin') {
      return res.status(403).json({ message: 'Cannot assign superadmin role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, status },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const requesterRole = req.user.role;
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.role === 'superadmin') {
      return res.status(403).json({ message: 'Cannot delete superadmin' });
    }

    if (requesterRole === 'user') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (targetUser.role === 'admin' && requesterRole !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmin can delete admins' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
