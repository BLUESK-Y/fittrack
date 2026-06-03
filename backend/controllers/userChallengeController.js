const UserChallenge = require("../models/UserChallenge");
const User = require("../models/User");
const { calculateScore } = require("../utils/scoreHelper");

const getUserChallenges = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;

    const records = await UserChallenge.find(filter).populate("challengeId");
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};

const joinChallenge = async (req, res, next) => {
  try {
    const { challengeId } = req.body;

    const existing = await UserChallenge.findOne({
      userId: req.user.id,
      challengeId,
      status: "active",
    });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already joined this challenge" });
    }

    const record = await UserChallenge.create({ userId: req.user.id, challengeId });
    res.status(201).json({ success: true, message: "Joined challenge", data: record });
  } catch (error) {
    next(error);
  }
};

const leaveChallenge = async (req, res, next) => {
  try {
    const record = await UserChallenge.findByIdAndUpdate(
      req.params.id,
      { status: "left", leftAt: new Date() },
      { new: true }
    );
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    res.status(200).json({ success: true, message: "Left challenge", data: record });
  } catch (error) {
    next(error);
  }
};

const completeChallenge = async (req, res, next) => {
  try {
    const record = await UserChallenge.findByIdAndUpdate(
      req.params.id,
      { status: "completed", progress: 100, completedAt: new Date() },
      { new: true }
    ).populate("challengeId");

    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    const points = record.challengeId?.points || 0;
    await User.findByIdAndUpdate(record.userId, { $inc: { totalPoints: points } });
    await calculateScore(record.userId);

    res.status(200).json({ success: true, message: "Challenge completed", data: record });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserChallenges, joinChallenge, leaveChallenge, completeChallenge };
