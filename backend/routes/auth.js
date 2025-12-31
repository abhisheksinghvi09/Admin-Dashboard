const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const createSuperAdmin = async () => {
  const exists = await User.findOne({ role: 'superadmin' });
  if (!exists) {
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    await User.create({
      name: 'Super Admin',
      email: 'superadmin@admin.com',
      password: hashedPassword,
      role: 'superadmin',
      status: 'active'
    });
    console.log('SuperAdmin created: superadmin@admin.com / superadmin123');
  }
};
createSuperAdmin();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.status === 'inactive') {
      return res.status(400).json({ message: 'Account is inactive' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
