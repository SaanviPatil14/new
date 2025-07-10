const express = require('express');
const { body, validationResult } = require('express-validator');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const { authenticateToken, requireAdmin, requireCandidate } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/candidates/register
// @desc    Register as a candidate (for users with candidate userType)
// @access  Private (Candidate only)
router.post('/register', [
  authenticateToken,
  requireCandidate,
  body('party')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Party name is required and must be less than 100 characters'),
  body('position')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Position is required and must be less than 100 characters'),
  body('manifesto')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Manifesto must be between 10 and 2000 characters'),
  body('experience')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Experience must be less than 500 characters'),
  body('education')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Education must be less than 500 characters')
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

    // Check if user is already registered as a candidate
    const existingCandidate = await Candidate.findOne({ userId: req.user._id });
    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered as a candidate'
      });
    }

    const { party, position, manifesto, experience, education } = req.body;

    // Create new candidate profile
    const candidate = new Candidate({
      userId: req.user._id,
      party,
      position,
      manifesto,
      experience,
      education
    });

    await candidate.save();

    res.status(201).json({
      success: true,
      message: 'Candidate registration successful. Waiting for admin approval.',
      data: {
        candidate
      }
    });

  } catch (error) {
    console.error('Candidate registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Candidate registration failed'
    });
  }
});

// @route   GET /api/candidates
// @desc    Get all approved candidates
// @access  Public
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find({ 
      isApproved: true, 
      isActive: true 
    }).populate('userId', 'firstName lastName email profileImage');

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

// @route   GET /api/candidates/:id
// @desc    Get candidate by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      isApproved: true,
      isActive: true
    }).populate('userId', 'firstName lastName email profileImage');

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.json({
      success: true,
      data: {
        candidate
      }
    });

  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidate'
    });
  }
});

// @route   GET /api/candidates/profile/me
// @desc    Get current user's candidate profile
// @access  Private (Candidate only)
router.get('/profile/me', authenticateToken, requireCandidate, async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user._id })
      .populate('userId', 'firstName lastName email profileImage');

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found'
      });
    }

    res.json({
      success: true,
      data: {
        candidate
      }
    });

  } catch (error) {
    console.error('Get candidate profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch candidate profile'
    });
  }
});

// @route   PUT /api/candidates/profile/me
// @desc    Update current user's candidate profile
// @access  Private (Candidate only)
router.put('/profile/me', [
  authenticateToken,
  requireCandidate,
  body('party')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Party name must be less than 100 characters'),
  body('position')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Position must be less than 100 characters'),
  body('manifesto')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Manifesto must be between 10 and 2000 characters'),
  body('experience')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Experience must be less than 500 characters'),
  body('education')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Education must be less than 500 characters')
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

    const { party, position, manifesto, experience, education } = req.body;
    const updateData = {};

    if (party) updateData.party = party;
    if (position) updateData.position = position;
    if (manifesto) updateData.manifesto = manifesto;
    if (experience) updateData.experience = experience;
    if (education) updateData.education = education;

    const candidate = await Candidate.findOneAndUpdate(
      { userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'firstName lastName email profileImage');

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Candidate profile updated successfully',
      data: {
        candidate
      }
    });

  } catch (error) {
    console.error('Update candidate profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update candidate profile'
    });
  }
});

// @route   GET /api/candidates/admin/pending
// @desc    Get all pending candidates (Admin only)
// @access  Private (Admin only)
router.get('/admin/pending', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const candidates = await Candidate.find({ 
      isApproved: false,
      isActive: true 
    }).populate('userId', 'firstName lastName email profileImage');

    res.json({
      success: true,
      data: {
        candidates
      }
    });

  } catch (error) {
    console.error('Get pending candidates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending candidates'
    });
  }
});

// @route   PUT /api/candidates/admin/approve/:id
// @desc    Approve a candidate (Admin only)
// @access  Private (Admin only)
router.put('/admin/approve/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate('userId', 'firstName lastName email profileImage');

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.json({
      success: true,
      message: 'Candidate approved successfully',
      data: {
        candidate
      }
    });

  } catch (error) {
    console.error('Approve candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve candidate'
    });
  }
});

// @route   DELETE /api/candidates/admin/:id
// @desc    Remove a candidate (Admin only)
// @access  Private (Admin only)
router.delete('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    res.json({
      success: true,
      message: 'Candidate removed successfully'
    });

  } catch (error) {
    console.error('Remove candidate error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove candidate'
    });
  }
});

module.exports = router; 