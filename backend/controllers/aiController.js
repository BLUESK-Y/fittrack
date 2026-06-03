const { GoogleGenerativeAI } = require("@google/generative-ai");
const Log = require("../models/Log");
const UserChallenge = require("../models/UserChallenge");
const Challenge = require("../models/Challenge");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const parseGeminiJSON = (raw) => {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!match) throw new Error("No JSON found in Gemini response");
  return JSON.parse(match[0]);
};

const getRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { userMessage } = req.body;

    const [recentLogs, activeChallenges] = await Promise.all([
      Log.find({ userId }).sort({ date: -1 }).limit(7),
      UserChallenge.find({ userId, status: "active" }).populate("challengeId"),
    ]);

    const logSummary = recentLogs
      .map((l) => `${l.date}: ${l.workoutType}, ${l.duration}min, ${l.calories}kcal, ${l.steps} steps`)
      .join("\n") || "No recent logs";

    const challengeSummary = activeChallenges
      .map((c) => c.challengeId?.title || "Unknown")
      .join(", ") || "None";

    const prompt = `
You are a professional fitness coach. ${userMessage ? `The user says: "${userMessage}".` : ""}

User's recent workout history (last 7 sessions):
${logSummary}

Currently active challenges: ${challengeSummary}

Based on the above, recommend 3 specific workout types that would benefit this user.
Respond with ONLY valid JSON (no markdown, no code blocks):
{"recommendations":[{"type":"Workout Type","reason":"Why this is good for them","duration":30,"frequency":"3x per week"}]}
    `.trim();

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const parsed = parseGeminiJSON(raw);

    res.status(200).json({ success: true, data: parsed });
  } catch (error) {
    console.error("[AI Error]", error.message);
    next(error);
  }
};

const predictProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { challengeId } = req.body;

    const [challenge, logs] = await Promise.all([
      Challenge.findById(challengeId),
      Log.find({ userId, challengeId }).sort({ date: 1 }),
    ]);

    if (!challenge) {
      return res.status(404).json({ success: false, message: "Challenge not found" });
    }

    const logsPerWeek = logs.length > 0
      ? (logs.length / Math.max(1, Math.ceil((Date.now() - new Date(logs[0].date)) / (7 * 24 * 60 * 60 * 1000))))
      : 0;

    const prompt = `
You are a fitness coach. Predict this user's challenge completion.

Challenge: "${challenge.title}" (${challenge.duration} days, ${challenge.level})
Days logged so far: ${logs.length}
Average logs per week: ${logsPerWeek.toFixed(1)}
Days remaining: ${challenge.duration - logs.length}

Respond with ONLY valid JSON (no markdown, no code blocks):
{"completionDate":"YYYY-MM-DD","likelihood":"High/Medium/Low","tips":["tip1","tip2","tip3"],"summary":"one sentence"}
    `.trim();

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const parsed = parseGeminiJSON(raw);

    res.status(200).json({ success: true, data: parsed });
  } catch (error) {
    console.error("[AI Error]", error.message);
    next(error);
  }
};

const analyzeSentiment = async (req, res, next) => {
  try {
    const { notes, logId } = req.body;

    if (!notes) {
      return res.status(400).json({ success: false, message: "Notes text is required" });
    }

    const prompt = `
Analyze the sentiment of this fitness journal entry:
"${notes}"

Respond with ONLY valid JSON (no markdown, no code blocks):
{"sentiment":"positive/negative/neutral","score":7,"keywords":["energetic","strong"]}

score is 0-10 (10 = most positive).
    `.trim();

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const parsed = parseGeminiJSON(raw);

    if (logId) {
      await Log.findByIdAndUpdate(logId, { sentiment: parsed.sentiment, notes });
    }

    res.status(200).json({ success: true, data: parsed });
  } catch (error) {
    console.error("[AI Error]", error.message);
    next(error);
  }
};

const recommendChallenges = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [recentLogs, userChallenges, allChallenges] = await Promise.all([
      Log.find({ userId }).sort({ date: -1 }).limit(20),
      UserChallenge.find({ userId, status: "active" }),
      Challenge.find({ isActive: true }),
    ]);

    const joinedIds = new Set(userChallenges.map((uc) => String(uc.challengeId)));
    const available = allChallenges.filter((c) => !joinedIds.has(String(c._id)));

    if (available.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const workoutTypes = [...new Set(recentLogs.map((l) => l.workoutType).filter(Boolean))];
    const avgDuration = recentLogs.length
      ? Math.round(recentLogs.reduce((s, l) => s + (l.duration || 0), 0) / recentLogs.length)
      : 0;
    const totalCalories = recentLogs.reduce((s, l) => s + (l.calories || 0), 0);

    const challengeList = available
      .map((c) => `ID:${c._id} | "${c.title}" | ${c.category} | ${c.level} | ${c.duration} days | ${c.points} pts`)
      .join("\n");

    const prompt = `
You are a fitness coach. Recommend exactly 3 challenges for this user from the list below.

User profile:
- Total sessions logged: ${recentLogs.length}
- Workout types practiced: ${workoutTypes.join(", ") || "none yet"}
- Average session duration: ${avgDuration} minutes
- Total calories burned: ${totalCalories}
- Current streak: ${req.user.currentStreak} days
- Fitness level (inferred from logs): ${recentLogs.length > 30 ? "Advanced" : recentLogs.length > 10 ? "Intermediate" : "Beginner"}

Available challenges (ID | Title | Category | Level | Duration | Points):
${challengeList}

Pick 3 challenges that best match the user's fitness level, habits, and gaps. For each, give a short personalised reason (max 12 words).

Respond with ONLY valid JSON (no markdown, no code blocks):
{"recommendations":[{"challengeId":"ID_HERE","reason":"Short personalised reason"}]}
    `.trim();

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const parsed = parseGeminiJSON(raw);

    const recs = (parsed.recommendations || []).slice(0, 3).map((r) => {
      const challenge = available.find((c) => String(c._id) === String(r.challengeId));
      if (!challenge) return null;
      return {
        challenge: {
          _id: challenge._id,
          title: challenge.title,
          category: challenge.category,
          level: challenge.level,
          duration: challenge.duration,
          points: challenge.points,
          image: challenge.image,
        },
        reason: r.reason,
      };
    }).filter(Boolean);

    res.status(200).json({ success: true, data: recs });
  } catch (error) {
    console.error("[AI Error]", error.message);
    next(error);
  }
};

module.exports = { getRecommendations, predictProgress, analyzeSentiment, recommendChallenges };
