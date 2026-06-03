const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
    date: { type: String, required: true },
    time: { type: String },
    workoutType: { type: String },
    duration: { type: Number },
    calories: { type: Number },
    steps: { type: Number, default: 0 },
    notes: { type: String },
    mood: { type: String },
    sentiment: { type: String },
  },
  { timestamps: true }
);

// Only enforce uniqueness when challengeId exists
logSchema.index(
  { userId: 1, challengeId: 1, date: 1 },
  { unique: true, partialFilterExpression: { challengeId: { $exists: true } } }
);

module.exports = mongoose.model("Log", logSchema);
