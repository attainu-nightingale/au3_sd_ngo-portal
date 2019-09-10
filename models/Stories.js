let db = require("../db/db");

const schema = {
  $jsonSchema: {
    bsonType: "object",
    additionalProperties: false,
    required: ["title", "image", "details", "createdBy"],
    properties: {
      _id: {
        bsonType: "objectId"
      },
      title: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      image: {
        bsonType: "string",
        description: "must be a image and is required"
      },
      details: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      link: {
        bsonType: "string"
      },
      createdBy: {
        bsonType: "string",
        description: "must be a string and is required"
      }
    }
  }
};

const Stories = async () => {
  await db
    .getDB()
    .db()
    .createCollection("stories");
  await db
    .getDB()
    .db()
    .command({
      collMod: "stories",
      validator: schema
    });
  return await db;
};

module.exports = Stories;
