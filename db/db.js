const { MongoClient, ObjectID } = require("mongodb");

// Mongo URL
const { url } = require("../config");

// DB
let _db;

const initDB = callback => {
  // If DB already connected and Initialized
  if (_db) {
    console.log("DB has already initialized");
    return callback(null, _db);
  }

  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
      _db = client;
      callback(null, _db);
    })
    .catch(err => {
      callback(err);
    });
};

const getDB = () => {
  if (!_db) {
    throw Error("DB not initialized");
  }
  return _db;
};

module.exports = {
  initDB,
  getDB,
  ObjectID
};
