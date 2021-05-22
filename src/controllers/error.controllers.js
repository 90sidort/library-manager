const HttpError = require('../utils/error');

const errorController = (req, res, next) =>
  next(new HttpError('Could not find this route.', 404));

module.exports = errorController;
