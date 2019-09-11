let db = require("../db/db");

const schema = {
  $jsonSchema: {
    bsonType: "object",
    additionalProperties: false,
    required: ["gurdianName", "name", "dob", "location"],
    properties: {
      _id: {
        bsonType: "objectId"
      },
      name: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      gurdianName: {
        bsonType: "string",
        description: "must be a email and is required"
      },
      dob: {
        bsonType: "string",
        description: "must be a date string and is required"
      },
      gender: {
        bsonType: "string"
      },
      location: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      profile_pic: {
        bsonType: "string"
      },
      studyStatus: {
        bsonType: "string"
      }
    }
  }
};

const Student = async () => {
  await db
    .getDB()
    .db()
    .createCollection("students");
  await db
    .getDB()
    .db()
    .command({
      collMod: "students",
      validator: schema
    });
  return await db;
};

module.exports = Student;
