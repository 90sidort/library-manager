const jwt = require('jsonwebtoken');
const HttpError = require('../utils/error');

const requireLogin = (req, res, next) => {
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
    next();
  } catch (err) {
    console.log(err);
    return next(new HttpError('Authentication failed!', 403));
  }
};

module.exports = requireLogin;
