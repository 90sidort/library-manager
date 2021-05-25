const mongoose = require('mongoose');

const authorModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: mongoose.Schema.ObjectId,
      ref: 'Country',
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Author', authorModel);
