const Log = require("../models/Log");
const User = require("../models/User");
const { calculateScore } = require("../utils/scoreHelper");
const { checkAndAwardBadges } = require("./badgeController");

const createLog = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { challengeId, date, workoutType, duration, calories, steps, notes, mood } = req.body;

    if (challengeId) {
  const existing = await Log.findOne({ userId, challengeId, date });
  if (existing) {
    return res.status(400).json({ success: false, message: "Log already exists for this challenge today" });
  }
}

    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const log = await Log.create({
      userId,
      challengeId: challengeId || undefined,
      date,
      time,
      workoutType,
      duration,
      calories,
      steps: steps || 0,
      notes,
      mood,
    });

    // Streak update
    const user = await User.findById(userId);
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split("T")[0];

    let newStreak = user.currentStreak;
    if (user.lastLogDate === today) {
      // same day, no change
    } else if (user.lastLogDate === yStr) {
      newStreak = user.currentStreak + 1;
    } else {
      newStreak = 1;
    }

    const longestStreak = Math.max(user.longestStreak, newStreak);
    await User.findByIdAndUpdate(userId, {
      currentStreak: newStreak,
      longestStreak,
      lastLogDate: today,
    });

    await calculateScore(userId);
    await checkAndAwardBadges(userId);

    res.status(201).json({ success: true, message: "Log created", data: log });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Log already exists for this date" });
    }
    next(error);
  }
};

const getLogs = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.userId) filter.userId = req.query.userId;
    if (req.query.challengeId) filter.challengeId = req.query.challengeId;

    const logs = await Log.find(filter).sort({ date: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

const updateLog = async (req, res, next) => {
  try {
    const log = await Log.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!log) {
      return res.status(404).json({ success: false, message: "Log not found" });
    }
    res.status(200).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

const deleteLog = async (req, res, next) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, message: "Log not found" });
    }
    res.status(200).json({ success: true, message: "Log deleted" });
  } catch (error) {
    next(error);
  }
};

const getProgressReport = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const userId = req.query.userId || req.user.id;

    const logs = await Log.find({ userId, challengeId }).sort({ date: 1 });

    const totalLogs = logs.length;
    const totalDuration = logs.reduce((s, l) => s + (l.duration || 0), 0);
    const totalCalories = logs.reduce((s, l) => s + (l.calories || 0), 0);
    const totalSteps = logs.reduce((s, l) => s + (l.steps || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalLogs,
        totalDuration,
        totalCalories,
        totalSteps,
        averageDuration: totalLogs ? Math.round(totalDuration / totalLogs) : 0,
        averageCalories: totalLogs ? Math.round(totalCalories / totalLogs) : 0,
        logs,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createLog, getLogs, updateLog, deleteLog, getProgressReport };
