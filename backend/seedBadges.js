require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Log = require("./models/Log");
const UserChallenge = require("./models/UserChallenge");
const UserBadge = require("./models/UserBadge");
const { checkAndAwardBadges } = require("./controllers/badgeController");

// Planned badge distribution (varied per user personality):
//
// Sarah Johnson    → Early Riser + Hydration Hero + Peak Performer + Consistency King + Challenge Champion  (5)
// Mike Chen        → Night Owl + Hydration Hero + Peak Performer + Consistency King                         (4)
// Emma Wilson      → Hydration Hero + Flexibility King + First Step                                         (3)
// James Rodriguez  → Hydration Hero + Peak Performer + Consistency King + Challenge Champion                (4)
// Priya Patel      → Hydration Hero + Peak Performer + Flexibility King + First Step                        (4)
// Alex Thompson    → First Step + Hydration Hero                                                            (2)
// David Kim        → First Step + Hydration Hero + Peak Performer                                           (3)
// nandana manoj    → First Step + Hydration Hero + Peak Performer                                           (3)

const tryLog = async (doc) => {
  try { await Log.create(doc); }
  catch (e) { if (e.code !== 11000) throw e; }
};

const main = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB\n");

  const allUsers = await User.find().select("-password");

  // ── Step 1: Clean up previous seedBadges.js data ──────────────────────────
  console.log("Cleaning up previous badge seed data...");

  const allUserIds = allUsers.map(u => u._id);

  // Remove all UserBadge records for all users
  await UserBadge.deleteMany({ userId: { $in: allUserIds } });

  // Remove January 2026 test logs added by previous seedBadges.js
  await Log.deleteMany({
    userId: { $in: allUserIds },
    date: { $regex: /^2026-01/ },
  });

  // Revert all test user UserChallenges back to "active"
  await UserChallenge.updateMany(
    { userId: { $in: allUserIds } },
    { status: "active", $unset: { completedAt: 1 } }
  );

  console.log("   Cleaned up\n");

  // ── Step 2: Helper to get user by email ───────────────────────────────────
  const byEmail = (email) => allUsers.find(u => u.email === email);

  // ── Step 3: Add targeted logs per user ────────────────────────────────────

  // SARAH — Early Riser (3 logs before 7AM) + Challenge Champion (3 completed)
  const sarah = byEmail("sarah.j@demo.com");
  if (sarah) {
    await tryLog({ userId: sarah._id, date: "2026-01-01", time: "05:30:00 AM", workoutType: "Running",  duration: 30, calories: 250, steps: 4000 });
    await tryLog({ userId: sarah._id, date: "2026-01-02", time: "06:00:00 AM", workoutType: "Cardio",   duration: 25, calories: 200, steps: 3500 });
    await tryLog({ userId: sarah._id, date: "2026-01-03", time: "06:45:00 AM", workoutType: "Cycling",  duration: 35, calories: 220, steps: 3000 });
    // Mark 3 of her joined challenges as completed
    const sarahUCs = await UserChallenge.find({ userId: sarah._id }).limit(3);
    for (const uc of sarahUCs) {
      await UserChallenge.findByIdAndUpdate(uc._id, { status: "completed", completedAt: new Date() });
    }
    console.log("   Sarah — added Early Riser logs + 3 completed challenges");
  }

  // MIKE — Night Owl (3 logs after 9PM)
  const mike = byEmail("mike.c@demo.com");
  if (mike) {
    await tryLog({ userId: mike._id, date: "2026-01-04", time: "09:30:00 PM", workoutType: "Cardio",   duration: 40, calories: 300, steps: 2500 });
    await tryLog({ userId: mike._id, date: "2026-01-05", time: "10:00:00 PM", workoutType: "Running",  duration: 35, calories: 280, steps: 3000 });
    await tryLog({ userId: mike._id, date: "2026-01-06", time: "10:45:00 PM", workoutType: "Strength", duration: 45, calories: 320, steps: 1500 });
    console.log("   Mike — added Night Owl logs");
  }

  // PRIYA — Flexibility King (needs 1 more Yoga log, already has 2 from seedUsers)
  const priya = byEmail("priya.p@demo.com");
  if (priya) {
    await tryLog({ userId: priya._id, date: "2026-01-07", time: "08:00:00 AM", workoutType: "Yoga", duration: 45, calories: 180, steps: 1000 });
    console.log("   Priya — added 3rd Yoga log (Flexibility King)");
  }

  // JAMES — Challenge Champion (3 completed challenges)
  const james = byEmail("james.r@demo.com");
  if (james) {
    const jamesUCs = await UserChallenge.find({ userId: james._id }).limit(3);
    for (const uc of jamesUCs) {
      await UserChallenge.findByIdAndUpdate(uc._id, { status: "completed", completedAt: new Date() });
    }
    console.log("   James — 3 completed challenges (Challenge Champion)");
  }

  // NANDANA MANOJ — First Step + Hydration Hero + Peak Performer
  const nandana = byEmail("nandanamanoj2020@gmail.com");
  if (nandana) {
    await tryLog({ userId: nandana._id, date: "2026-01-01", time: "08:00:00 AM", workoutType: "Running",  duration: 30, calories: 250, steps: 12000 }); // Peak Performer
    await tryLog({ userId: nandana._id, date: "2026-01-02", time: "08:00:00 AM", workoutType: "Cardio",   duration: 25, calories: 200, steps: 3000 });
    await tryLog({ userId: nandana._id, date: "2026-01-03", time: "08:00:00 AM", workoutType: "Cycling",  duration: 35, calories: 220, steps: 2500 });
    await tryLog({ userId: nandana._id, date: "2026-01-04", time: "08:00:00 AM", workoutType: "Strength", duration: 40, calories: 280, steps: 2000 });
    await tryLog({ userId: nandana._id, date: "2026-01-05", time: "08:00:00 AM", workoutType: "Running",  duration: 30, calories: 250, steps: 3000 });
    console.log("   Nandana — added basic logs");
  }

  // ── Step 4: Run badge checker for ALL users ────────────────────────────────
  console.log("\nRunning badge checks...\n");

  const results = [];
  for (const user of allUsers) {
    const awarded = await checkAndAwardBadges(user._id);
    results.push({ name: user.name, awarded });
    console.log(`   ${user.name.padEnd(20)} → ${awarded.length > 0 ? awarded.join(", ") : "—"}`);
  }

  // ── Step 5: Summary table ──────────────────────────────────────────────────
  console.log("\n─────────────────────────────────────────────────────");
  console.log("Badge Summary:");
  console.log("─────────────────────────────────────────────────────");

  for (const user of allUsers) {
    const badges = await UserBadge.find({ userId: user._id }).populate("badgeId");
    const names = badges.map(b => b.badgeId?.name || "?").join(", ") || "None";
    console.log(`  ${user.name.padEnd(20)} (${badges.length}) → ${names}`);
  }

  const total = await UserBadge.countDocuments();
  console.log(`\nDone! Total UserBadge records: ${total}`);
  console.log("─────────────────────────────────────────────────────");

  await mongoose.disconnect();
};

main().catch(err => {
  console.error("Failed:", err.message);
  process.exit(1);
});
