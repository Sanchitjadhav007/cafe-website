const mongoose = require('mongoose');

let connectionPromise;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
});

const ReviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

const connectToMongo = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable is not set.');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri);
  }

  return connectionPromise;
};

const normalizeReview = (body) => {
  const parsed = typeof body === 'string' ? JSON.parse(body || '{}') : body || {};
  return {
    name: String(parsed.name || parsed.username || '').trim(),
    comment: String(parsed.comment || parsed.content || '').trim(),
    rating: Number(parsed.rating || 0)
  };
};

const serializeReview = (review) => ({
  id: String(review._id),
  name: review.name,
  username: review.name,
  comment: review.comment,
  content: review.comment,
  rating: review.rating,
  createdAt: review.createdAt
});

const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: getHeaders(), body: '' };
  }

  if (event.httpMethod === 'GET') {
    try {
      await connectToMongo();
      const reviews = await Review.find().sort({ createdAt: -1 }).limit(100);

      return {
        statusCode: 200,
        headers: getHeaders(),
        body: JSON.stringify(reviews.map(serializeReview))
      };
    } catch (error) {
      console.error('Review fetch error:', error);
      return {
        statusCode: 500,
        headers: getHeaders(),
        body: JSON.stringify({ status: 'error', error: error.message })
      };
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: getHeaders(),
      body: JSON.stringify({ error: 'Method Not Allowed. Use POST or GET.' })
    };
  }

  try {
    const { name, rating, comment } = normalizeReview(event.body);

    if (!name || !comment || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return {
        statusCode: 400,
        headers: getHeaders(),
        body: JSON.stringify({ error: 'Name, comment, and a 1-5 rating are required.' })
      };
    }

    await connectToMongo();
    const review = await Review.create({ name, comment, rating });

    return {
      statusCode: 200,
      headers: getHeaders(),
      body: JSON.stringify({
        status: 'success',
        message: 'Review saved to Chat Station!',
        review: serializeReview(review)
      })
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      statusCode: 500,
      headers: getHeaders(),
      body: JSON.stringify({ status: 'error', error: error.message })
    };
  }
};

module.exports = { handler };
