const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const electionId = 'general-2024';

    // Get various statistics
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalVoters = await User.countDocuments({ userType: 'voter', isActive: true });
    const totalCandidates = await User.countDocuments({ userType: 'candidate', isActive: true });
    const pendingCandidates = await Candidate.countDocuments({ isApproved: false, isActive: true });
    const approvedCandidates = await Candidate.countDocuments({ isApproved: true, isActive: true });
    const totalVotes = await Vote.getTotalVotes(electionId);

    // Calculate voter turnout
    const voterTurnout = totalVoters > 0 ? ((totalVotes / totalVoters) * 100).toFixed(2) : 0;

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
      isActive: true
    });

    // Get recent votes (last 24 hours)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const recentVotes = await Vote.countDocuments({
      votedAt: { $gte: oneDayAgo },
      isValid: true
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalVoters,
        totalCandidates,
        pendingCandidates,
        approvedCandidates,
        totalVotes,
        voterTurnout: `${voterTurnout}%`,
        recentRegistrations,
        recentVotes
      }
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (Admin only)
// @access  Private (Admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, userType, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = { isActive: true };
    if (userType) query.userType = userType;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: skip + users.length < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Toggle user active status (Admin only)
// @access  Private (Admin only)
router.put('/users/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin only)
router.delete('/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Soft delete - mark as inactive
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// @route   GET /api/admin/candidates
// @desc    Get all candidates with details (Admin only)
// @access  Private (Admin only)
router.get('/candidates', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { isActive: true };
    
    if (status === 'pending') {
      query.isApproved = false;
    } else if (status === 'approved') {
      query.isApproved = true;
    }

    const candidates = await Candidate.find(query)
      .populate('userId', 'firstName lastName email username createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        candidates
      }
    });

  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidates'
    });
  }
});

// @route   GET /api/admin/votes
// @desc    Get all votes with details (Admin only)
// @access  Private (Admin only)
router.get('/votes', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const electionId = 'general-2024';

    const votes = await Vote.find({ electionId, isValid: true })
      .populate('voterId', 'firstName lastName email')
      .populate('candidateId', 'party position')
      .populate('candidateId.userId', 'firstName lastName')
      .sort({ votedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Vote.countDocuments({ electionId, isValid: true });

    res.json({
      success: true,
      data: {
        votes,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalVotes: total,
          hasNext: skip + votes.length < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get votes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch votes'
    });
  }
});

// @route   POST /api/admin/create-admin
// @desc    Create a new admin user (Admin only)
// @access  Private (Admin only)
router.post('/create-admin', [
  authenticateToken,
  requireAdmin,
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be less than 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be less than 50 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      });
    }

    // Create new admin user
    const adminUser = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      userType: 'admin'
    });

    await adminUser.save();

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        user: adminUser.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin user'
    });
  }
});

module.exports = router; 