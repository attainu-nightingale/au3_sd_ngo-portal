let db = require("../db/db");

const schema = {
  $jsonSchema: {
    bsonType: "object",
    additionalProperties: false,
    required: [
      "username",
      "email",
      "fullname",
      "dob",
      "password",
      "occupation",
      "location"
    ],
    properties: {
      _id: {
        bsonType: "objectId"
      },
      username: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      email: {
        bsonType: "string",
        description: "must be a email and is required"
      },
      fullname: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      occupation: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      dob: {
        bsonType: "string",
        description: "must be a  string and is required"
      },
      gender: {
        bsonType: "string"
      },
      number: {
        bsonType: "string"
      },
      location: {
        bsonType: "string",
        description: "must be a  string and is required"
      },
      profile_pic: {
        bsonType: "string"
      },
      preExperience: {
        bsonType: "string"
      },
      password: {
        bsonType: "string",
        minLength: 6
      },
      secretToken: {
        bsonType: "string"
      },
      active: {
        bsonType: "bool"
      }
    }
  }
};

const Vol = async () => {
  await db
    .getDB()
    .db()
    .createCollection("volunteers");
  await db
    .getDB()
    .db()
    .command({
      collMod: "volunteers",
      validator: schema
    });

  await db
    .getDB()
    .db()
    .collection("volunteers")
    .createIndex({ username: 1 }, { unique: true });
  await db
    .getDB()
    .db()
    .collection("volunteers")
    .createIndex({ email: 1 }, { unique: true });

  return await db;
};

module.exports = Vol;
