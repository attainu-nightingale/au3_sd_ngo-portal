let db = require("../db/db");

const schema = {
  $jsonSchema: {
    bsonType: "object",
    additionalProperties: false,
    required: [
      "activity_name",
      "activity_type",
      "activity_image",
      "activity_details"
    ],
    properties: {
      _id: {
        bsonType: "objectId"
      },
      activity_name: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      activity_type: {
        bsonType: "string",
        description: "must be a image and is required"
      },
      activity_image: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      activity_details: {
        bsonType: "string",
        description: "must be a string and is required"
      },
      activity_link: {
        bsonType: "string"
      },
      createdBy: {
        bsonType: "string",
        description: "must be a string and is required"
      }
    }
  }
};

const Activities = async () => {
  await db
    .getDB()
    .db()
    .createCollection("activities");
  await db
    .getDB()
    .db()
    .command({
      collMod: "activities",
      validator: schema
    });
  return await db;
};

module.exports = Activities;
