const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const HttpError = require('../utils/error');

const requireAdmin = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new HttpError('Authentication failed!', 403));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded.userId);
    const admin = await Admin.findOne({ admin: decoded.userId });
    if (!admin) return next(new HttpError('Not authorized!', 403));
    next();
  } catch (e) {
    return next(new HttpError('Authentication failed!', 403));
  }
};

module.exports = requireAdmin;
