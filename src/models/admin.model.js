const mongoose = require('mongoose');

const adminModel = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminModel);
