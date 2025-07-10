const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Middleware to check if user is candidate
const requireCandidate = (req, res, next) => {
  if (req.user.userType !== 'candidate') {
    return res.status(403).json({
      success: false,
      message: 'Candidate access required'
    });
  }
  next();
};

// Middleware to check if user is voter
const requireVoter = (req, res, next) => {
  if (req.user.userType !== 'voter') {
    return res.status(403).json({
      success: false,
      message: 'Voter access required'
    });
  }
  next();
};

// Middleware to check if user is admin or candidate
const requireAdminOrCandidate = (req, res, next) => {
  if (req.user.userType !== 'admin' && req.user.userType !== 'candidate') {
    return res.status(403).json({
      success: false,
      message: 'Admin or candidate access required'
    });
  }
  next();
};

// Middleware to check if user is admin or voter
const requireAdminOrVoter = (req, res, next) => {
  if (req.user.userType !== 'admin' && req.user.userType !== 'voter') {
    return res.status(403).json({
      success: false,
      message: 'Admin or voter access required'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireCandidate,
  requireVoter,
  requireAdminOrCandidate,
  requireAdminOrVoter
}; 