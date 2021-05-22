const mongoose = require('mongoose');

const authorModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [1, 'Author name must be at least 1 character long!'],
      maxLength: [500, 'Author name must be at most 500 character long!'],
      trim: true,
    },
    surname: {
      type: String,
      required: true,
      minLength: [1, 'Author surname must be at least 1 character long!'],
      maxLength: [500, 'Author surname must be at most 500 character long!'],
      trim: true,
    },
    country: {
      type: mongoose.Schema.ObjectId,
      ref: 'Country',
    },
    books: [{ type: mongoose.Schema.ObjectId, ref: 'Book' }],
    description: {
      type: String,
      required: false,
      maxLength: [
        2000,
        'Author description must be at most 2000 character long!',
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Author', authorModel);
