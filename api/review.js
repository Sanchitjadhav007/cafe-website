import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let client;
let db;

export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {

    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
      db = client.db("cafe");
    }

    const collection = db.collection("reviews");

    if (req.method === "POST") {

      await collection.insertOne(req.body);

      return res.json({message:"Review saved"});
    }

    if (req.method === "GET") {

      const reviews = await collection.find().toArray();

      return res.json(reviews);
    }

  } catch(err) {

    return res.status(500).json({message:"Server error"});
  }

}