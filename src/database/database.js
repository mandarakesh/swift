const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://qrewrakesh:185D1a0151@rakesh.cbifh.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri);

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
