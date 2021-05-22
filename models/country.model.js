const mongoose = require('mongoose');

const countryModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [1, 'Country name must be at least 1 character long!'],
      maxLength: [500, 'Country name must be at most 500 character long!'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Country', countryModel);
