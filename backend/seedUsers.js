require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Log = require("./models/Log");
const UserChallenge = require("./models/UserChallenge");
const Challenge = require("./models/Challenge");

// Returns "YYYY-MM-DD" string N days ago from today
const dateStr = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};

// ─── Test users ───────────────────────────────────────────────────────────────
const TEST_USERS = [
  { name: "Sarah Johnson",   email: "sarah.j@demo.com",  totalPoints: 850, currentStreak: 12, longestStreak: 18 },
  { name: "Mike Chen",       email: "mike.c@demo.com",   totalPoints: 720, currentStreak: 8,  longestStreak: 15 },
  { name: "Emma Wilson",     email: "emma.w@demo.com",   totalPoints: 630, currentStreak: 5,  longestStreak: 10 },
  { name: "James Rodriguez", email: "james.r@demo.com",  totalPoints: 580, currentStreak: 7,  longestStreak: 12 },
  { name: "Priya Patel",     email: "priya.p@demo.com",  totalPoints: 490, currentStreak: 3,  longestStreak: 9  },
  { name: "Alex Thompson",   email: "alex.t@demo.com",   totalPoints: 320, currentStreak: 2,  longestStreak: 5  },
  { name: "David Kim",       email: "david.k@demo.com",  totalPoints: 410, currentStreak: 4,  longestStreak: 8  },
];

// Helper: insert one log, silently skip if duplicate (unique index violation)
const createLog = async (userId, challengeId, daysAgo, workoutType, duration, calories, steps) => {
  try {
    await Log.create({
      userId,
      challengeId,
      date: dateStr(daysAgo),
      time: "08:30:00 AM",
      workoutType,
      duration,
      calories,
      steps,
    });
  } catch (e) {
    if (e.code !== 11000) throw e;
  }
};

const main = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB\n");

  // ── 1. Load first 5 active challenges ──────────────────────────────────────
  const challenges = await Challenge.find({ isActive: true }).limit(5);
  if (!challenges.length) {
    console.error("No challenges found. Run: node seed.js");
    process.exit(1);
  }
  const [c0, c1, c2, c3, c4] = challenges;
  console.log("Challenges loaded:");
  challenges.forEach((c, i) => console.log(`   [${i}] ${c.title}`));

  // ── 2. Create / update test users ──────────────────────────────────────────
  console.log("\nCreating users...");
  const pw = await bcrypt.hash("Password123", 10);
  const users = [];

  for (const u of TEST_USERS) {
    const calcScore = (data) =>
      data.totalPoints * 2 + data.currentStreak * 10;

    const existing = await User.findOne({ email: u.email });
    if (!existing) {
      const created = await User.create({
        ...u,
        password: pw,
        score: calcScore(u),
        lastLogDate: dateStr(0),
      });
      users.push(created);
      console.log(`   Created: ${u.name}`);
    } else {
      const updated = await User.findByIdAndUpdate(
        existing._id,
        {
          totalPoints: u.totalPoints,
          currentStreak: u.currentStreak,
          longestStreak: u.longestStreak,
          score: calcScore(u),
          lastLogDate: dateStr(0),
        },
        { new: true }
      );
      users.push(updated);
      console.log(`   Updated: ${u.name}`);
    }
  }

  const [u0, u1, u2, u3, u4, u5, u6] = users;
  const userIds = users.map((u) => u._id);

  // ── 3. Clear old test data ─────────────────────────────────────────────────
  await Log.deleteMany({ userId: { $in: userIds } });
  await UserChallenge.deleteMany({ userId: { $in: userIds } });
  console.log("\nCleared old logs & user challenges");

  // ── 4. Activity logs ───────────────────────────────────────────────────────
  console.log("\nCreating logs...");

  // ── c0: 30-Day Cardio Blast ────────────────────────────────────────────────
  // Today's logs (all 7 users) → powers global leaderboard steps & calories tabs
  await createLog(u0._id, c0._id, 0, "Running",  75, 720, 15420);
  await createLog(u1._id, c0._id, 0, "Cardio",   60, 580, 12300);
  await createLog(u2._id, c0._id, 0, "Cycling",  45, 430,  9800);
  await createLog(u3._id, c0._id, 0, "Running",  70, 650, 11500);
  await createLog(u4._id, c0._id, 0, "Running",  40, 380,  8900);
  await createLog(u5._id, c0._id, 0, "Cardio",   30, 280,  6200);
  await createLog(u6._id, c0._id, 0, "Cycling",  55, 500, 10100);
  // Past days
  await createLog(u0._id, c0._id, 1, "Running",  65, 600, 14000);
  await createLog(u0._id, c0._id, 2, "Cardio",   70, 650, 13500);
  await createLog(u0._id, c0._id, 3, "Running",  60, 580, 12000);
  await createLog(u1._id, c0._id, 1, "Cardio",   55, 520, 11000);
  await createLog(u1._id, c0._id, 2, "Running",  60, 550, 12000);
  await createLog(u3._id, c0._id, 1, "Running",  60, 580, 10500);
  await createLog(u3._id, c0._id, 2, "Cardio",   65, 600, 11000);
  await createLog(u6._id, c0._id, 1, "Cycling",  50, 480, 10000);
  await createLog(u6._id, c0._id, 2, "Cycling",  55, 500, 10200);
  await createLog(u2._id, c0._id, 1, "Cycling",  40, 400,  9000);
  await createLog(u4._id, c0._id, 1, "Running",  35, 350,  8000);
  await createLog(u5._id, c0._id, 1, "Cardio",   25, 250,  5500);
  console.log(`   Done: ${c0.title}`);

  // ── c1: 6-Week Strength Builder ────────────────────────────────────────────
  await createLog(u3._id, c1._id, 0, "Strength", 80, 550, 3000);
  await createLog(u3._id, c1._id, 1, "Strength", 75, 520, 2800);
  await createLog(u3._id, c1._id, 2, "Strength", 70, 500, 2500);
  await createLog(u0._id, c1._id, 1, "Strength", 70, 500, 2000);
  await createLog(u0._id, c1._id, 2, "Strength", 65, 480, 1900);
  await createLog(u0._id, c1._id, 3, "Strength", 60, 460, 1800);
  await createLog(u1._id, c1._id, 1, "Strength", 60, 450, 1800);
  await createLog(u1._id, c1._id, 2, "Strength", 55, 420, 1700);
  await createLog(u6._id, c1._id, 1, "Strength", 50, 400, 1500);
  await createLog(u6._id, c1._id, 2, "Strength", 45, 380, 1400);
  await createLog(u2._id, c1._id, 2, "Strength", 40, 350, 1200);
  await createLog(u4._id, c1._id, 3, "Strength", 35, 300, 1000);
  console.log(`   Done: ${c1.title}`);

  // ── c2: 21-Day Yoga Flow ───────────────────────────────────────────────────
  await createLog(u2._id, c2._id, 0, "Yoga", 60, 250, 2000);
  await createLog(u2._id, c2._id, 1, "Yoga", 55, 230, 1800);
  await createLog(u2._id, c2._id, 2, "Yoga", 50, 220, 1700);
  await createLog(u4._id, c2._id, 0, "Yoga", 50, 210, 1600);
  await createLog(u4._id, c2._id, 1, "Yoga", 45, 200, 1500);
  await createLog(u1._id, c2._id, 1, "Yoga", 40, 180, 1200);
  await createLog(u1._id, c2._id, 2, "Yoga", 45, 190, 1300);
  await createLog(u5._id, c2._id, 1, "Yoga", 35, 160, 1000);
  await createLog(u5._id, c2._id, 2, "Yoga", 30, 140,  900);
  await createLog(u6._id, c2._id, 2, "Yoga", 30, 150, 1100);
  await createLog(u0._id, c2._id, 3, "Yoga", 40, 180, 1400);
  console.log(`   Done: ${c2.title}`);

  // ── c3: Marathon Prep 60-Day ───────────────────────────────────────────────
  await createLog(u0._id, c3._id, 0, "Running", 90, 850, 18000);
  await createLog(u0._id, c3._id, 1, "Running", 85, 800, 17000);
  await createLog(u0._id, c3._id, 2, "Running", 80, 760, 16500);
  await createLog(u1._id, c3._id, 0, "Running", 75, 720, 15000);
  await createLog(u1._id, c3._id, 1, "Running", 70, 680, 14000);
  await createLog(u4._id, c3._id, 0, "Running", 65, 620, 13500);
  await createLog(u4._id, c3._id, 1, "Running", 60, 580, 12500);
  await createLog(u4._id, c3._id, 2, "Running", 55, 540, 11500);
  await createLog(u3._id, c3._id, 1, "Running", 60, 580, 12000);
  await createLog(u6._id, c3._id, 2, "Running", 50, 500, 10500);
  await createLog(u2._id, c3._id, 3, "Running", 45, 450,  9500);
  await createLog(u5._id, c3._id, 3, "Running", 35, 350,  7500);
  console.log(`   Done: ${c3.title}`);

  // ── c4: Core Crusher 14-Day ────────────────────────────────────────────────
  await createLog(u1._id, c4._id, 0, "Strength", 35, 280, 1500);
  await createLog(u1._id, c4._id, 1, "Strength", 30, 260, 1400);
  await createLog(u2._id, c4._id, 0, "Yoga",     30, 240, 1200);
  await createLog(u2._id, c4._id, 1, "Yoga",     28, 220, 1100);
  await createLog(u5._id, c4._id, 0, "Cardio",   25, 200, 1000);
  await createLog(u5._id, c4._id, 1, "Cardio",   22, 195,  980);
  await createLog(u0._id, c4._id, 2, "Strength", 40, 320, 1600);
  await createLog(u0._id, c4._id, 3, "Strength", 35, 290, 1500);
  await createLog(u4._id, c4._id, 2, "Cardio",   25, 210, 1100);
  await createLog(u6._id, c4._id, 3, "Strength", 30, 250, 1200);
  console.log(`   Done: ${c4.title}`);

  // ── 5. UserChallenge (join) records ───────────────────────────────────────
  console.log("\nCreating UserChallenge records...");

  const joinMatrix = [
    // [user, [challenge indexes they joined]]
    [u0, [0, 1, 2, 3]],
    [u1, [0, 1, 2, 3, 4]],
    [u2, [0, 1, 2, 4]],
    [u3, [0, 1, 3]],
    [u4, [0, 2, 3, 4]],
    [u5, [0, 2, 4]],
    [u6, [0, 1, 2, 3]],
  ];

  for (const [user, cIdxs] of joinMatrix) {
    for (const cIdx of cIdxs) {
      await UserChallenge.create({
        userId: user._id,
        challengeId: challenges[cIdx]._id,
        status: "active",
        joinedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 86400000),
      });
    }
    console.log(`   ${user.name} joined ${cIdxs.length} challenges`);
  }

  // ── 6. Summary ─────────────────────────────────────────────────────────────
  const totalLogs = await Log.countDocuments({ userId: { $in: userIds } });
  const totalJoins = await UserChallenge.countDocuments({ userId: { $in: userIds } });

  console.log("\n─────────────────────────────────────────");
  console.log("Seed complete!");
  console.log(`   Users created/updated : ${users.length}`);
  console.log(`   Logs created          : ${totalLogs}`);
  console.log(`   Challenge joins       : ${totalJoins}`);
  console.log("\nLogin credentials for test users:");
  console.log("   Email: sarah.j@demo.com  | Password: Password123");
  console.log("   Email: mike.c@demo.com   | Password: Password123");
  console.log("─────────────────────────────────────────");

  await mongoose.disconnect();
};

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
