const express = require('express');
const { authenticateToken, requireVoter } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/voters/dashboard
// @desc    Get voter dashboard
// @access  Private (Voter only)
router.get('/dashboard', authenticateToken, requireVoter, async (req, res) => {
  try {
    const Vote = require('../models/Vote');
    const Candidate = require('../models/Candidate');
    const electionId = 'general-2024';

    // Check if voter has already voted
    const hasVoted = await Vote.hasVoted(req.user._id, electionId);

    // Get total candidates
    const totalCandidates = await Candidate.countDocuments({ 
      isApproved: true, 
      isActive: true 
    });

    // Get total votes cast
    const totalVotes = await Vote.getTotalVotes(electionId);

    // Get voter's vote if they have voted
    let myVote = null;
    if (hasVoted) {
      const vote = await Vote.findOne({
        voterId: req.user._id,
        electionId
      }).populate('candidateId', 'party position')
        .populate('candidateId.userId', 'firstName lastName');
      
      if (vote) {
        myVote = {
          candidate: {
            name: `${vote.candidateId.userId.firstName} ${vote.candidateId.userId.lastName}`,
            party: vote.candidateId.party,
            position: vote.candidateId.position
          },
          votedAt: vote.votedAt
        };
      }
    }

    res.json({
      success: true,
      data: {
        hasVoted,
        totalCandidates,
        totalVotes,
        myVote
      }
    });

  } catch (error) {
    console.error('Voter dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch voter dashboard'
    });
  }
});

module.exports = router; 