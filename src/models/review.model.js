const mongoose = require('mongoose');

const reviewModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'Review',
    },
    review: {
      type: String,
      required: false,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 3,
    },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    book: { type: mongoose.Schema.ObjectId, ref: 'Book' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewModel);
