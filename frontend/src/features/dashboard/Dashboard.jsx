import React, { useEffect, useState } from "react";
import AppNavbar from "../../components/navbar/navbar";
import LogForm from "../../components/LogForm/LogForm";
import ActivityChart from "../../components/ActivityChart/ActivityChart";
import "./Dashboard.css";
import CalendarView from "../../components/CalenderView/CalenderView";
import Badge from "../../components/badges/badge";
import JoinedChallenges from "../../components/JoinedChallenges";
import RecentSessions from "../../components/RecentSessions/RecentSessions";
import api from "../../services/api";
import { StreakIcon, dumbellIcon, stepCountIcon, caloriesIcon } from "../../assets";
import Footer from "../../components/footer/footer";

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchLogs();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    }
  };

  const fetchLogs = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) return;
      const res = await api.get(`/logs?userId=${storedUser.id || storedUser._id}`);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalWorkouts = logs.length;
  const totalCalories = logs.reduce((acc, log) => acc + (log.calories || 0), 0);
  const totalSteps = logs.reduce((acc, log) => acc + (log.steps || 0), 0);

  const calcStreak = () => {
    if (logs.length === 0) return 0;
    const uniqueDays = [...new Set(logs.map((log) => new Date(log.date).toDateString()))]
      .map((d) => new Date(d))
      .sort((a, b) => b - a);

    let streak = 0;
    let check = new Date();
    check.setHours(0, 0, 0, 0);

    for (const day of uniqueDays) {
      const d = new Date(day);
      d.setHours(0, 0, 0, 0);
      if (d.getTime() === check.getTime()) {
        streak++;
        check.setDate(check.getDate() - 1);
      } else break;
    }
    return streak;
  };

  const currentStreak = user?.currentStreak ?? calcStreak();

  return (
    <>
      <AppNavbar />

      <div className="dashboard-top">
        <div className="welcome-row">
          <div>
            <h1>Welcome back, {user?.name || "User"}!</h1>
            <p>"Consistency is the key to breakthrough." You're doing great!</p>
          </div>
          <div className="points-badge">
            <span className="points-icon">⭐</span>
            <div>
              <p>Total Points</p>
              <h3>{user?.totalPoints || 0} pts</h3>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><img src={StreakIcon} alt="" /></div>
            <div>
              <span className="badge green">Active</span>
              <p>Current Streak</p>
              <h2>{currentStreak} Days</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><img src={dumbellIcon} alt="" /></div>
            <div>
              <span className="badge green">Total</span>
              <p>Total Workouts</p>
              <h2>{totalWorkouts} Sess.</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><img src={caloriesIcon} alt="" /></div>
            <div>
              <span className="badge blue">All Time</span>
              <p>Calories Burnt</p>
              <h2>{totalCalories.toLocaleString()} kcal</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><img src={stepCountIcon} alt="" /></div>
            <div>
              <span className="badge green">Progress</span>
              <p>Steps Count</p>
              <h2>{totalSteps.toLocaleString()}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-grid-top">
          <ActivityChart />
          <CalendarView />
        </div>

        <div className="dashboard-full">
          <Badge />
        </div>

        <div className="dashboard-grid-bottom">
  <div className="bottom-left">
    <RecentSessions key={refreshKey} onRefresh={fetchLogs} />
  </div>
  <div className="bottom-right">
    <LogForm onLogged={() => { fetchLogs(); setRefreshKey(k => k + 1); }} />
  </div>
</div>

        <div className="dashboard-full">
          <JoinedChallenges />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
