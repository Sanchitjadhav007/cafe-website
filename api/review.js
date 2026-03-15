import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let db;

export default async function handler(req, res) {

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", " https://sanchitjadhav007.github.io/cafe-website/");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  useNewUrlParser: true;
  useUnifiedTopology: true;

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {

    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
      db = client.db("Cluster-1");
    }

    const collection = db.collection("reviews");

    // Save review
    if (req.method === "POST") {

      const review = req.body;

      await collection.insertOne(review);

      return res.status(200).json({ message: "Review saved" });

    }

    // Get reviews
    if (req.method === "GET") {

      const reviews = await collection.find().toArray();

      return res.status(200).json(reviews);

    }

  } catch (error) {

    console.error(error);

    return res.status(500).json({ message: "Server error" });

  }
}