const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  party: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  position: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  manifesto: {
    type: String,
    required: true,
    maxlength: 2000
  },
  experience: {
    type: String,
    maxlength: 500
  },
  education: {
    type: String,
    maxlength: 500
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  voteCount: {
    type: Number,
    default: 0
  },
  campaignImage: {
    type: String,
    default: ''
  },
  socialLinks: {
    website: String,
    twitter: String,
    facebook: String,
    instagram: String
  },
  achievements: [{
    title: String,
    description: String,
    year: Number
  }]
}, {
  timestamps: true
});

// Index for better query performance
candidateSchema.index({ userId: 1 });
candidateSchema.index({ isApproved: 1, isActive: 1 });
candidateSchema.index({ voteCount: -1 });

// Virtual for full name
candidateSchema.virtual('fullName').get(function() {
  return `${this.userId.firstName} ${this.userId.lastName}`;
});

// Method to increment vote count
candidateSchema.methods.incrementVoteCount = function() {
  this.voteCount += 1;
  return this.save();
};

module.exports = mongoose.model('Candidate', candidateSchema); 