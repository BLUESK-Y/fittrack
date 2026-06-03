const Badge = require("../models/Badge");
const UserBadge = require("../models/UserBadge");
const Log = require("../models/Log");
const User = require("../models/User");
const UserChallenge = require("../models/UserChallenge");

const BADGE_DEFINITIONS = [
  {
    name: "Early Riser",
    description: "Log 3+ workouts before 7:00 AM",
    icon: "🌅",
    criteria: "3 workouts before 07:00",
    type: "habit",
  },
  {
    name: "Hydration Hero",
    description: "Log 5+ total workouts",
    icon: "💧",
    criteria: "5 total logs",
    type: "milestone",
  },
  {
    name: "Peak Performer",
    description: "Log 10,000+ steps in a single session",
    icon: "🏔️",
    criteria: "10000 steps in one log",
    type: "performance",
  },
  {
    name: "Flexibility King",
    description: "Complete 3+ Yoga sessions",
    icon: "🧘",
    criteria: "3 Yoga logs",
    type: "workout",
  },
  {
    name: "Night Owl",
    description: "Log 3+ workouts after 9:00 PM",
    icon: "🦉",
    criteria: "3 workouts after 21:00",
    type: "habit",
  },
  {
    name: "Consistency King",
    description: "Maintain a 7-day streak",
    icon: "👑",
    criteria: "currentStreak >= 7",
    type: "streak",
  },
  {
    name: "Challenge Champion",
    description: "Complete 3+ challenges",
    icon: "🏆",
    criteria: "3 completed challenges",
    type: "challenge",
  },
  {
    name: "First Step",
    description: "Log your very first workout",
    icon: "👟",
    criteria: "1 log",
    type: "milestone",
  },
];

const seedBadges = async () => {
  for (const def of BADGE_DEFINITIONS) {
    await Badge.findOneAndUpdate({ name: def.name }, def, { upsert: true });
  }
};

const getAllBadges = async (req, res, next) => {
  try {
    await seedBadges();
    const badges = await Badge.find();
    res.status(200).json({ success: true, data: badges });
  } catch (error) {
    next(error);
  }
};

const getUserBadges = async (req, res, next) => {
  try {
    const userBadges = await UserBadge.find({ userId: req.params.userId }).populate("badgeId");
    res.status(200).json({ success: true, data: userBadges });
  } catch (error) {
    next(error);
  }
};

const checkAndAwardBadges = async (userId) => {
  try {
    await seedBadges();

    const [user, logs, completedChallenges, earnedBadges, allBadges] = await Promise.all([
      User.findById(userId),
      Log.find({ userId }),
      UserChallenge.countDocuments({ userId, status: "completed" }),
      UserBadge.find({ userId }).select("badgeId"),
      Badge.find(),
    ]);

    const earnedIds = earnedBadges.map((ub) => String(ub.badgeId));
    const newlyAwarded = [];

    const parseHour = (timeStr) => {
      if (!timeStr) return -1;
      const clean = timeStr.replace(/\s?(AM|PM)/i, "");
      const [h, m] = clean.split(":").map(Number);
      const isPM = /PM/i.test(timeStr);
      if (isPM && h !== 12) return h + 12;
      if (!isPM && h === 12) return 0;
      return h;
    };

    const criteriaMap = {
      "Early Riser": logs.filter((l) => parseHour(l.time) < 7 && parseHour(l.time) >= 0).length >= 3,
      "Hydration Hero": logs.length >= 5,
      "Peak Performer": logs.some((l) => (l.steps || 0) >= 10000),
      "Flexibility King": logs.filter((l) => l.workoutType === "Yoga").length >= 3,
      "Night Owl": logs.filter((l) => parseHour(l.time) >= 21).length >= 3,
      "Consistency King": (user?.currentStreak || 0) >= 7,
      "Challenge Champion": completedChallenges >= 3,
      "First Step": logs.length >= 1,
    };

    for (const badge of allBadges) {
      if (earnedIds.includes(String(badge._id))) continue;
      if (criteriaMap[badge.name]) {
        await UserBadge.create({ userId, badgeId: badge._id });
        newlyAwarded.push(badge.name);
      }
    }

    return newlyAwarded;
  } catch (err) {
    console.error("Badge check error:", err.message);
    return [];
  }
};

const checkAndAwardBadgesRoute = async (req, res, next) => {
  try {
    const awarded = await checkAndAwardBadges(req.params.userId);
    res.status(200).json({ success: true, message: "Badges checked", data: { awarded } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBadges, getUserBadges, checkAndAwardBadges, checkAndAwardBadgesRoute };
