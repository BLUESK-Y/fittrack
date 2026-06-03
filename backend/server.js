require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const { updateChallengesWithDetailedData } = require("./config/updateChallenges");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const userChallengeRoutes = require("./routes/userChallengeRoutes");
const logRoutes = require("./routes/logRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const badgeRoutes = require("./routes/badgeRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://capstone-project-two-sigma.vercel.app',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/user-challenges", userChallengeRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await updateChallengesWithDetailedData();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
