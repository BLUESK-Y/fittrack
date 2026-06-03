const User = require("../models/User");
const Log = require("../models/Log");

const getGlobalLeaderboard = async (req, res, next) => {
  try {
    const type = req.query.type || "points";
    const today = new Date().toISOString().split("T")[0];

    const [users, allLogs] = await Promise.all([User.find().select("-password"), Log.find()]);

    const todayLogs = allLogs.filter((l) => l.date === today);

    const todayStatsMap = {};
    todayLogs.forEach((log) => {
      const uid = String(log.userId);
      if (!todayStatsMap[uid]) todayStatsMap[uid] = { steps: 0, calories: 0, duration: 0 };
      todayStatsMap[uid].steps += Number(log.steps || 0);
      todayStatsMap[uid].calories += Number(log.calories || 0);
      todayStatsMap[uid].duration += Number(log.duration || 0);
    });

    let leaderboard = [];

    if (type === "points") {
      leaderboard = users
        .filter((u) => (u.totalPoints || 0) > 0)
        .map((u) => {
          const ts = todayStatsMap[String(u._id)] || { steps: 0, calories: 0, duration: 0 };
          return { id: u._id, name: u.name, value: u.totalPoints || 0, ...ts };
        });
    } else {
      leaderboard = Object.keys(todayStatsMap).map((userId) => {
        const user = users.find((u) => String(u._id) === userId);
        const ts = todayStatsMap[userId];
        return {
          id: userId,
          name: user?.name || "Unknown",
          value: type === "steps" ? ts.steps : ts.calories,
          totalPoints: user?.totalPoints || 0,
          ...ts,
        };
      });
    }

    leaderboard.sort((a, b) => b.value - a.value);
    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
};

const getChallengeLeaderboard = async (req, res, next) => {
  try {
    const { id: challengeId } = req.params;
    const [logs, users] = await Promise.all([
      Log.find({ challengeId }),
      User.find().select("-password"),
    ]);

    const statsMap = {};
    logs.forEach((log) => {
      const uid = String(log.userId);
      if (!statsMap[uid]) statsMap[uid] = { steps: 0, calories: 0, duration: 0, logCount: 0 };
      statsMap[uid].steps += Number(log.steps || 0);
      statsMap[uid].calories += Number(log.calories || 0);
      statsMap[uid].duration += Number(log.duration || 0);
      statsMap[uid].logCount += 1;
    });

    const leaderboard = Object.keys(statsMap).map((userId) => {
      const user = users.find((u) => String(u._id) === userId);
      return { id: userId, name: user?.name || "Unknown", ...statsMap[userId] };
    });

    leaderboard.sort((a, b) => b.duration - a.duration);
    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
};

const getScoreLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ score: -1 }).limit(50);
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = { getGlobalLeaderboard, getChallengeLeaderboard, getScoreLeaderboard };
