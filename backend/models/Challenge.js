const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({
  day: Number,
  type: { type: String, enum: ["workout", "rest"] },
  name: String,
  sets: { type: Number, default: null },
  reps: { type: String, default: null },
});

const weekSchema = new mongoose.Schema({
  week: Number,
  title: String,
  status: { type: String, default: "locked" },
  days: [daySchema],
});

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
    duration: { type: Number, required: true },
    points: { type: Number, default: 100 },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    heroImage: { type: String },
    tags: [String],
    participants: { type: Number, default: 0 },
    equipment: { type: String },
    coach: { name: String, avatar: String },
    rating: { value: { type: Number, default: 0 }, reviews: { type: Number, default: 0 } },
    overview: { short: String, long: String },
    roadmap: [weekSchema],
    rules: [String],
    benefits: [{ title: String, description: String }],
    included: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Challenge", challengeSchema);
