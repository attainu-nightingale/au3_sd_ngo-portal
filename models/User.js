let db = require("../db/db");

const schema = {
  $jsonSchema: {
    bsonType: "object",
    additionalProperties: false,
    required: ["username", "email", "name", "dob", "password"],
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
      name: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      dob: {
        bsonType: "string",
        description: "must be a date string and is required"
      },
      gender: {
        bsonType: "string"
      },
      location: {
        bsonType: "string"
      },
      profile_pic: {
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

const User = async () => {
  await db
    .getDB()
    .db()
    .createCollection("users");
  await db
    .getDB()
    .db()
    .command({
      collMod: "users",
      validator: schema
    });

  await db
    .getDB()
    .db()
    .collection("users")
    .createIndex({ username: 1 }, { unique: true });

  return await db;
};

module.exports = User;
