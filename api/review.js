const { MongoClient } = require("mongodb");

let client;
let db;

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (!client) {
      client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      db = client.db("cafe");
    }

    const collection = db.collection("reviews");

    if (req.method === "POST") {
      await collection.insertOne(req.body);
      return res.status(200).json({ message: "Review saved" });
    }

    if (req.method === "GET") {
      const reviews = await collection.find().sort({ _id: -1 }).toArray();
      return res.status(200).json(reviews);
    }

    return res.status(405).json({ message: "Method not allowed" });

  } catch (err) {
    console.error("MongoDB connection error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};