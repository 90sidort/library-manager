require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const genresRouter = require('./src/routes/genre.routes');
const errorController = require('./src/controllers/error.controllers');
const countryRouter = require('./src/routes/country.routes');
const userRouter = require('./src/routes/user.routes');
const authorRouter = require('./src/routes/author.routes');
const bookRouter = require('./src/routes/book.routes');
const reviewRouter = require('./src/routes/review.routes');
const bookingRouter = require('./src/routes/borrowing.routes');

const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@localhost:27017/${process.env.MONGO_DATABASE}?retryWrites=false&authSource=admin`;
const port = process.env.PORT;

const app = express();

app.use(bodyParser.json());
app.use('/api/genres', genresRouter);
app.use('/api/countries', countryRouter);
app.use('/api/users', userRouter);
app.use('/api/authors', authorRouter);
app.use('/api/books', bookRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/borrows', bookingRouter);
app.use(errorController);
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  return res.json({ message: error.message || 'An unknown error occured.' });
});

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`API started on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
