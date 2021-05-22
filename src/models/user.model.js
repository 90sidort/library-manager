const mongoose = require('mongoose');
const mongooseValidator = require('mongoose-unique-validator');

const userModel = new mongoose.Schema(
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
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    borrowed: {
      type: [{ type: mongoose.Schema.ObjectId, ref: 'Book' }],
      required: false,
      default: null,
    },
    about: {
      type: String,
      required: false,
    },
    archived: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

userModel.plugin(mongooseValidator);

module.exports = mongoose.model('User', userModel);
