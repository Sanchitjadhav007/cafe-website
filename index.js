const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB (LOCAL)
mongoose.connect("mongodb://127.0.0.1:27017/cafeDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ✅ Schema (ADD HERE)
const ReviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true }
});

// ✅ Model
const Review = mongoose.model("Review", ReviewSchema);

// ✅ POST (Save review)
app.post("/api/reviews", async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        res.json({ message: "Review saved" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ GET (Fetch reviews)
app.get("/api/reviews", async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Start server
app.listen(8080, () => {
    console.log("Server running on http://localhost:8080");
});