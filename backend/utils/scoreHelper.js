const User = require("../models/User");
const Log = require("../models/Log");
const UserChallenge = require("../models/UserChallenge");

const calculateScore = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const totalLogs = await Log.countDocuments({ userId });
  const completedChallenges = await UserChallenge.countDocuments({ userId, status: "completed" });

  const score =
    user.totalPoints * 2 +
    user.currentStreak * 10 +
    totalLogs * 5 +
    completedChallenges * 50;

  await User.findByIdAndUpdate(userId, { score });
  return score;
};

module.exports = { calculateScore };
