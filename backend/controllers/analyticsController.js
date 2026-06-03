const Log = require("../models/Log");
const Challenge = require("../models/Challenge");

const getProgressChartData = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.user.id;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const fromDate = thirtyDaysAgo.toISOString().split("T")[0];

    const logs = await Log.find({ userId, date: { $gte: fromDate } }).sort({ date: 1 });

    const grouped = {};
    logs.forEach((log) => {
      if (!grouped[log.date]) grouped[log.date] = { duration: 0, calories: 0, steps: 0 };
      grouped[log.date].duration += log.duration || 0;
      grouped[log.date].calories += log.calories || 0;
      grouped[log.date].steps += log.steps || 0;
    });

    const data = Object.entries(grouped).map(([date, stats]) => ({ date, ...stats }));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getWeeklySummary = async (req, res, next) => {
  try {
    const userId = req.query.userId || req.user.id;

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const fromDate = weekStart.toISOString().split("T")[0];

    const logs = await Log.find({ userId, date: { $gte: fromDate } });

    const totalWorkouts = logs.length;
    const totalDuration = logs.reduce((s, l) => s + (l.duration || 0), 0);
    const totalCalories = logs.reduce((s, l) => s + (l.calories || 0), 0);
    const totalSteps = logs.reduce((s, l) => s + (l.steps || 0), 0);

    const typeCounts = {};
    logs.forEach((l) => {
      if (l.workoutType) typeCounts[l.workoutType] = (typeCounts[l.workoutType] || 0) + 1;
    });
    const mostCommonWorkoutType =
      Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a])[0] || null;

    const dayDurations = {};
    logs.forEach((l) => {
      dayDurations[l.date] = (dayDurations[l.date] || 0) + (l.duration || 0);
    });
    const bestDay =
      Object.keys(dayDurations).sort((a, b) => dayDurations[b] - dayDurations[a])[0] || null;

    res.status(200).json({
      success: true,
      data: { totalWorkouts, totalDuration, totalCalories, totalSteps, mostCommonWorkoutType, bestDay },
    });
  } catch (error) {
    next(error);
  }
};

const getChallengeChartData = async (req, res, next) => {
  try {
    const { challengeId } = req.params;
    const userId = req.query.userId || req.user.id;

    const [challenge, logs] = await Promise.all([
      Challenge.findById(challengeId),
      Log.find({ userId, challengeId }).sort({ date: 1 }),
    ]);

    const data = logs.map((l) => ({
      date: l.date,
      duration: l.duration || 0,
      calories: l.calories || 0,
      steps: l.steps || 0,
    }));

    const progressPercentage = challenge
      ? Math.min(Math.round((logs.length / challenge.duration) * 100), 100)
      : 0;

    res.status(200).json({ success: true, data: { chartData: data, progressPercentage } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProgressChartData, getWeeklySummary, getChallengeChartData };
