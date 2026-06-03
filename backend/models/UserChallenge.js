const mongoose = require("mongoose");

const userChallengeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
    status: { type: String, enum: ["active", "completed", "left"], default: "active" },
    progress: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    leftAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserChallenge", userChallengeSchema);
