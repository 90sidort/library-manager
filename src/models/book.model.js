const mongoose = require('mongoose');
const listOfLanguages = require('../utils/languages.enum');

const bookModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    pages: {
      type: Number,
      required: true,
    },
    published: {
      type: Number,
      required: true,
    },
    genre: {
      type: [{ type: mongoose.Schema.ObjectId, ref: 'Genre' }],
      validate: {
        validator(arr) {
          return arr.length < 4;
        },
        message: 'Cannot assing more than 3 genres',
      },
    },
    language: {
      type: String,
      required: true,
      enum: {
        values: listOfLanguages,
        message: '{VALUE} is not a valid language.',
      },
    },
    publisher: {
      type: String,
      required: true,
      trim: true,
    },
    available: { type: Boolean, required: true, default: true },
    borrower: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    authors: {
      type: [{ type: mongoose.Schema.ObjectId, ref: 'Author' }],
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookModel);
