const jwt = require('jsonwebtoken');
const HttpError = require('../utils/error');

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
    req.query.admin = decoded.admin;
    next();
  } catch (err) {
    return next(new HttpError('Authentication failed!', 403));
  }
};

module.exports = requireLogin;
