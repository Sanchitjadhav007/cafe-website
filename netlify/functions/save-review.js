import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

let connectionPromise;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;
    if (!uri) {
      throw new Error('MONGO_URI environment variable is not set.');
    }

    connectionPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority'
    });
  }

  await connectionPromise;
}

export async function handler(event) {
  try {
    await connectToDatabase();

    if (event.httpMethod === 'GET') {
      const reviews = await Review.find().sort({ createdAt: -1 }).limit(50);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(reviews)
      };
    }

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Method Not Allowed' })
      };
    }

    const body = JSON.parse(event.body || '{}');
    const name = body.name || body.username || '';
    const comment = body.comment || body.content || body.message || '';
    const rating = Number(body.rating || 0);

    if (!name || !comment || !rating) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Name, comment, and rating are required.' })
      };
    }

    const review = await Review.create({ name, comment, rating });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ status: 'success', review })
    };
  } catch (error) {
    console.error('Review save error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message })
    };
  }
}