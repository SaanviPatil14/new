const express = require('express');
const { body, validationResult } = require('express-validator');
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const { authenticateToken, requireVoter } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/votes/cast
// @desc    Cast a vote
// @access  Private (Voter only)
router.post('/cast', [
  authenticateToken,
  requireVoter,
  body('candidateId')
    .isMongoId()
    .withMessage('Valid candidate ID is required')
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

    const { candidateId } = req.body;
    const electionId = 'general-2024'; // You can make this dynamic

    // Check if candidate exists and is approved
    const candidate = await Candidate.findOne({
      _id: candidateId,
      isApproved: true,
      isActive: true
    });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found or not approved'
      });
    }

    // Check if voter has already voted
    const hasVoted = await Vote.hasVoted(req.user._id, electionId);
    if (hasVoted) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted in this election'
      });
    }

    // Create vote record
    const vote = new Vote({
      voterId: req.user._id,
      candidateId,
      electionId,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });

    await vote.save();

    // Increment candidate vote count
    await candidate.incrementVoteCount();

    res.status(201).json({
      success: true,
      message: 'Vote cast successfully',
      data: {
        vote: {
          id: vote._id,
          candidateId: vote.candidateId,
          votedAt: vote.votedAt
        }
      }
    });

  } catch (error) {
    console.error('Cast vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cast vote'
    });
  }
});

// @route   GET /api/votes/results
// @desc    Get election results
// @access  Public
router.get('/results', async (req, res) => {
  try {
    const electionId = 'general-2024'; // You can make this dynamic

    // Get all approved candidates with their vote counts
    const candidates = await Candidate.find({
      isApproved: true,
      isActive: true
    }).populate('userId', 'firstName lastName');

    // Get vote counts for each candidate
    const results = await Promise.all(
      candidates.map(async (candidate) => {
        const voteCount = await Vote.getCandidateVoteCount(candidate._id, electionId);
        return {
          candidate: {
            id: candidate._id,
            name: `${candidate.userId.firstName} ${candidate.userId.lastName}`,
            party: candidate.party,
            position: candidate.position
          },
          voteCount
        };
      })
    );

    // Sort by vote count (descending)
    results.sort((a, b) => b.voteCount - a.voteCount);

    // Get total votes
    const totalVotes = await Vote.getTotalVotes(electionId);

    res.json({
      success: true,
      data: {
        results,
        totalVotes,
        electionId
      }
    });

  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch election results'
    });
  }
});

// @route   GET /api/votes/my-vote
// @desc    Get current user's vote
// @access  Private (Voter only)
router.get('/my-vote', authenticateToken, requireVoter, async (req, res) => {
  try {
    const electionId = 'general-2024';
    const vote = await Vote.findOne({
      voterId: req.user._id,
      electionId
    }).populate('candidateId', 'party position')
      .populate('candidateId.userId', 'firstName lastName');

    if (!vote) {
      return res.status(404).json({
        success: false,
        message: 'No vote found for this election'
      });
    }

    res.json({
      success: true,
      data: {
        vote: {
          id: vote._id,
          candidate: {
            id: vote.candidateId._id,
            name: `${vote.candidateId.userId.firstName} ${vote.candidateId.userId.lastName}`,
            party: vote.candidateId.party,
            position: vote.candidateId.position
          },
          votedAt: vote.votedAt
        }
      }
    });

  } catch (error) {
    console.error('Get my vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vote'
    });
  }
});

// @route   GET /api/votes/has-voted
// @desc    Check if current user has voted
// @access  Private (Voter only)
router.get('/has-voted', authenticateToken, requireVoter, async (req, res) => {
  try {
    const electionId = 'general-2024';
    const hasVoted = await Vote.hasVoted(req.user._id, electionId);

    res.json({
      success: true,
      data: {
        hasVoted
      }
    });

  } catch (error) {
    console.error('Check has voted error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check voting status'
    });
  }
});

// @route   GET /api/votes/stats
// @desc    Get voting statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const electionId = 'general-2024';

    // Get total votes
    const totalVotes = await Vote.getTotalVotes(electionId);

    // Get total registered voters (users with voter type)
    const User = require('../models/User');
    const totalVoters = await User.countDocuments({ userType: 'voter', isActive: true });

    // Get total candidates
    const totalCandidates = await Candidate.countDocuments({ 
      isApproved: true, 
      isActive: true 
    });

    // Calculate voter turnout
    const voterTurnout = totalVoters > 0 ? ((totalVotes / totalVoters) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        totalVotes,
        totalVoters,
        totalCandidates,
        voterTurnout: `${voterTurnout}%`,
        electionId
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch voting statistics'
    });
  }
});

module.exports = router; 