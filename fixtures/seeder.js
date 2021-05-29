require('dotenv').config();
const { Seeder } = require('mongo-seeding');
const path = require('path');

const mongoURI = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@localhost:27017/${process.env.MONGO_DATABASE}?authSource=admin`;

const configuration = {
  database: mongoURI,
  dropDatabase: true,
};

const seeder = new Seeder(configuration);

const collections = seeder.readCollectionsFromPath(path.resolve('./fixtures'));

const loadData = async function () {
  try {
    await seeder.import(collections);
  } catch (err) {
    console.log(err);
  }
};

loadData();
