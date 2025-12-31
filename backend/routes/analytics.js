const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/stats', auth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const newSignups = await User.countDocuments({ createdAt: { $gte: lastWeek } });

    res.json({
      totalUsers,
      activeUsers,
      adminCount,
      newSignups
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/chart-data', auth, async (req, res) => {
  try {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    const monthlyData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(currentYear, 0, 1) }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const signups = new Array(12).fill(0);
    monthlyData.forEach(item => {
      signups[item._id - 1] = item.count;
    });

    res.json({ labels: months, signups });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
