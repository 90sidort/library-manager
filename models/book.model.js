const mongoose = require('mongoose');
const listOfLanguages = require('../utils/languages.enum');

const bookModel = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [1, 'Book title must be at least 1 character long!'],
      maxLength: [500, 'Book title must be at most 500 character long!'],
      trim: true,
    },
    pages: {
      type: Number,
      required: true,
      min: [1, 'Book must have at least 1 page!'],
      max: [10000, 'Book cannot have more than 10000 pages!'],
    },
    published: {
      type: Number,
      required: true,
      min: [1900, 'Book cannot be puslihed before 1900'],
      max: [3000, 'Book cannot be published after 3000'],
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
      minLength: [1, 'Publisher name must be at least 1 character long!'],
      maxLength: [1500, 'Publisher name must be at most 1500 character long!'],
      trim: true,
    },
    available: { type: Boolean, required: true },
    borrower: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    authors: [{ type: mongoose.Schema.ObjectId, ref: 'Author' }],
    description: {
      type: String,
      required: false,
      maxLength: [
        2000,
        'Book description must be at most 2000 character long!',
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookModel);
