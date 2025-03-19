const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL);

const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

const db = client.db("node_assignment");

module.exports = { connectDB, db };
