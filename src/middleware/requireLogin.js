const jwt = require('jsonwebtoken');
const HttpError = require('../utils/error');
const Admin = require('../models/admin.model');

const requireLogin = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new HttpError('Authentication failed!', 403));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.query.userId = decoded.userId;
    req.query.admin = false;
    const admin = await Admin.findOne({ admin: decoded.userId });
    if (admin) req.query.admin = true;
    next();
  } catch (err) {
    return next(new HttpError('Authentication failed!', 403));
  }
};

module.exports = requireLogin;
