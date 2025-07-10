const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  voterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  electionId: {
    type: String,
    required: true,
    default: 'general-2024' // You can make this dynamic for multiple elections
  },
  votedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  isValid: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate votes from same voter in same election
voteSchema.index({ voterId: 1, electionId: 1 }, { unique: true });

// Index for querying votes by candidate
voteSchema.index({ candidateId: 1, electionId: 1 });

// Index for vote validation
voteSchema.index({ isValid: 1, votedAt: -1 });

// Method to check if voter has already voted
voteSchema.statics.hasVoted = async function(voterId, electionId) {
  const vote = await this.findOne({ voterId, electionId });
  return !!vote;
};

// Method to get vote count for a candidate
voteSchema.statics.getCandidateVoteCount = async function(candidateId, electionId) {
  const count = await this.countDocuments({ 
    candidateId, 
    electionId, 
    isValid: true 
  });
  return count;
};

// Method to get total votes for an election
voteSchema.statics.getTotalVotes = async function(electionId) {
  const count = await this.countDocuments({ 
    electionId, 
    isValid: true 
  });
  return count;
};

module.exports = mongoose.model('Vote', voteSchema); 