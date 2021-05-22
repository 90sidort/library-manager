require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false`;
const port = process.env.PORT;

const app = express();

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`API started on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
