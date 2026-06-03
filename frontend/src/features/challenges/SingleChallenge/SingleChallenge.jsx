import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import AppNavbar from "../../../components/navbar/navbar";
import Footer from "../../../components/footer/footer";
import "./SingleChallenge.css";

const getBenefitIcon = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("fat") || t.includes("loss") || t.includes("burn")) return "🔥";
  if (t.includes("muscle") || t.includes("strength") || t.includes("power")) return "💪";
  if (t.includes("endurance") || t.includes("cardio") || t.includes("stamina")) return "❤️";
  if (t.includes("flex") || t.includes("mobility") || t.includes("stretch")) return "🧘";
  if (t.includes("speed") || t.includes("agility")) return "⚡";
  if (t.includes("mental") || t.includes("mind") || t.includes("focus") || t.includes("fortitude")) return "🧠";
  if (t.includes("posture") || t.includes("back")) return "🦴";
  if (t.includes("energy")) return "⚡";
  if (t.includes("sport") || t.includes("multi")) return "🏅";
  if (t.includes("peak") || t.includes("perform")) return "📈";
  return "🏆";
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
};

const DOT_COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#f59e0b", "#ef4444"];

const TABS = [
  { label: "Overview",      key: "overview" },
  { label: "Program Rules", key: "programrules" },
  { label: "Benefits",      key: "benefits" },
  { label: "Leaderboard",   key: "leaderboard" },
];

const SingleChallenge = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isJoined, setIsJoined] = useState(false);
  const [userChallengeId, setUserChallengeId] = useState(null);
  const [topChallengers, setTopChallengers] = useState([]);
  const [joining, setJoining] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [showLockedCard, setShowLockedCard] = useState(false);
  const [joinedAt, setJoinedAt] = useState(null);
  const [challengeLogs, setChallengeLogs] = useState([]);
  const [logSaving, setLogSaving] = useState(false);
  const [logMsg, setLogMsg] = useState(null);
  const [todayLogged, setTodayLogged] = useState(false);
  const [todayLogId, setTodayLogId] = useState(null);
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [moodText, setMoodText] = useState("");
  const [moodSaving, setMoodSaving] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [predLoading, setPredLoading] = useState(false);
  const [predError, setPredError] = useState("");

  useEffect(() => {
    fetchChallenge();
    fetchTopChallengers();
    checkIfJoined();
  }, [id]);

  useEffect(() => {
    if (isJoined) checkTodayLog();
  }, [isJoined]);

  const checkTodayLog = async () => {
    try {
      const uid = user?.id || user?._id;
      const today = new Date().toISOString().slice(0, 10);
      const res = await api.get(`/logs?userId=${uid}&challengeId=${id}`);
      const logs = Array.isArray(res.data) ? res.data : [];
      setChallengeLogs(logs);
      setTodayLogged(logs.some((l) => l.date?.slice(0, 10) === today));
    } catch { /* ignore */ }
  };

  const fetchChallenge = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/challenges/${id}`);
      setChallenge(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopChallengers = async () => {
    try {
      const res = await api.get(`/leaderboard/challenge/${id}`);
      setTopChallengers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const checkIfJoined = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/user-challenges?userId=${user.id || user._id}`);
      const list = Array.isArray(res.data) ? res.data : [];
      const entry = list.find(
        (r) =>
          String(r.challengeId?._id || r.challengeId) === String(id) &&
          r.status === "active"
      );
      if (entry) {
        setIsJoined(true);
        setUserChallengeId(entry._id);
        setJoinedAt(entry.joinedAt);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = async () => {
    if (!user || joining) return;
    setJoining(true);
    try {
      const res = await api.post("/user-challenges", { challengeId: id });
      setIsJoined(true);
      setUserChallengeId(res.data._id);
      setJoinedAt(res.data.joinedAt || new Date().toISOString());
      setShowLockedCard(false);
    } catch (err) {
      console.error(err);
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave this challenge?")) return;
    try {
      await api.delete(`/user-challenges/${userChallengeId}`);
      setIsJoined(false);
      setUserChallengeId(null);
      setSelectedWeek(null);
      setShowLockedCard(false);
    } catch (err) {
      console.error(err);
    }
  };

  const toUTCDay = (dateVal) => {
    const s = new Date(dateVal).toISOString().slice(0, 10);
    const [y, m, d] = s.split('-').map(Number);
    return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  };

  const getTodayTask = () => {
    if (!joinedAt || !challenge?.roadmap?.length) return null;
    const globalDay = toUTCDay(new Date()) - toUTCDay(joinedAt) + 1;
    for (let wi = 0; wi < challenge.roadmap.length; wi++) {
      for (const day of challenge.roadmap[wi].days || []) {
        if (wi * 7 + day.day === globalDay) return { ...day, dayNumber: globalDay };
      }
    }
    return null;
  };

  const handleMarkDone = async () => {
    setLogSaving(true);
    setLogMsg(null);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const now = new Date().toTimeString().slice(0, 5);
      const res = await api.post("/logs", {
        challengeId: id,
        date: today,
        time: now,
        workoutType: challenge?.category || "Cardio",
        duration: 1,
        calories: 0,
        steps: 0,
      });
      setTodayLogId(res.data._id);
      setShowMoodForm(true);
      await checkTodayLog();
    } catch (err) {
      setLogMsg({ success: false, text: err?.response?.data?.message || "Already logged today." });
    } finally {
      setLogSaving(false);
    }
  };

  const handleMoodSubmit = async () => {
    if (!moodText.trim() || !todayLogId) { setShowMoodForm(false); return; }
    setMoodSaving(true);
    try {
      await api.post("/ai/sentiment", { notes: moodText, logId: todayLogId });
      await checkTodayLog();
    } catch { /* fail silently */ }
    finally {
      setMoodSaving(false);
      setShowMoodForm(false);
      setMoodText("");
    }
  };

  const handleSkipMood = () => { setShowMoodForm(false); setMoodText(""); };

  const fetchPrediction = async () => {
    setPredLoading(true);
    setPredError("");
    try {
      const res = await api.post("/ai/predict", { challengeId: id });
      setPrediction(res.data);
    } catch {
      setPredError("Could not generate prediction. Try again.");
    } finally {
      setPredLoading(false);
    }
  };

  const getWeekStatuses = () => {
    if (!isJoined || !challenge?.roadmap?.length) return {};
    const joinDay = toUTCDay(joinedAt || new Date());
    const completedGlobalDays = new Set(
      challengeLogs.map((log) => toUTCDay(log.date) - joinDay + 1)
    );
    const statuses = {};
    let prevCompleted = true;
    for (let wi = 0; wi < challenge.roadmap.length; wi++) {
      const week = challenge.roadmap[wi];
      const workoutDays = (week.days || []).filter((d) => d.type === "workout");
      const allDone = workoutDays.length > 0 &&
        workoutDays.every((d) => completedGlobalDays.has(wi * 7 + d.day));
      if (allDone) {
        statuses[week.week] = "completed";
        prevCompleted = true;
      } else if (prevCompleted) {
        statuses[week.week] = "active";
        prevCompleted = false;
      } else {
        statuses[week.week] = "locked";
      }
    }
    return statuses;
  };

  const handleWeekClick = (week) => {
    if (!isJoined) {
      setSelectedWeek(null);
      setShowLockedCard(true);
    } else {
      setSelectedWeek(selectedWeek?.week === week.week ? null : week);
      setShowLockedCard(false);
    }
  };

  if (loading) {
    return (
      <>
        <AppNavbar />
        <div className="sc-loading">
          <div className="sc-spinner" />
          <p>Loading challenge...</p>
        </div>
      </>
    );
  }

  if (!challenge) {
    return (
      <>
        <AppNavbar />
        <div className="sc-loading"><p>Challenge not found.</p></div>
      </>
    );
  }

  const heroImage = challenge.heroImage || challenge.image || "";
  const currentUserId = String(user?.id || user?._id || "");
  const roadmap = challenge.roadmap || [];
  const weekStatuses = getWeekStatuses();
  const completedWeeks = Object.values(weekStatuses).filter((s) => s === "completed").length;
  const progressPercent = roadmap.length > 0 ? Math.round((completedWeeks / roadmap.length) * 100) : 0;

  /* ── Reusable content blocks ── */
  const RulesContent = () => (
    <>
      <h2 className="sc-section-title">Program Rules</h2>
      {(challenge.rules || []).length === 0 ? (
        <p className="sc-empty-text">No rules specified.</p>
      ) : (
        <div className="sc-rules-grid">
          {challenge.rules.map((rule, i) => (
            <div key={i} className="sc-rule-card">
              <div className="sc-rule-check">✓</div>
              <span>{rule}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const BenefitsContent = () => (
    <>
      <h2 className="sc-section-title">What You'll Achieve</h2>
      {(challenge.benefits || []).length === 0 ? (
        <p className="sc-empty-text">No benefits listed.</p>
      ) : (
        <div className="sc-benefits-grid">
          {challenge.benefits.map((benefit, i) => (
            <div key={i} className="sc-benefit-card">
              <div className="sc-benefit-icon">{getBenefitIcon(benefit.title)}</div>
              <h4 className="sc-benefit-title">{benefit.title}</h4>
              <p className="sc-benefit-desc">{benefit.description}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <>
      <AppNavbar />
      <div className="sc-page">

        {/* ── HERO ── */}
        <section
          className="sc-hero"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="sc-hero-overlay" />
          <div className="sc-hero-content">
            <div className="sc-tags">
              {(challenge.tags || []).map((tag, i) => (
                <span key={i} className="sc-tag">{tag}</span>
              ))}
            </div>
            <h1 className="sc-title">{challenge.title}</h1>
            <div className="sc-coach-row">
              {challenge.coach?.avatar && (
                <img
                  src={challenge.coach.avatar}
                  alt={challenge.coach?.name}
                  className="sc-coach-avatar"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              )}
              <span className="sc-coach-name">
                with <strong>{challenge.coach?.name || "Expert Coach"}</strong>
              </span>
              {challenge.rating?.value > 0 && (
                <>
                  <span className="sc-rating">⭐ {challenge.rating.value}</span>
                  <span className="sc-reviews">
                    ({(challenge.rating.reviews || 0).toLocaleString()} reviews)
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── TABS ── */}
        <div className="sc-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`sc-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
          {isJoined && (
            <button
              className={`sc-tab ${activeTab === "myprogress" ? "active" : ""}`}
              onClick={() => setActiveTab("myprogress")}
            >
              My Progress
            </button>
          )}
        </div>

        {/* ── BODY ── */}
        <div className="sc-body">

          {/* LEFT COLUMN */}
          <div className="sc-left">

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <>
                {/* Roadmap */}
                <h2 className="sc-roadmap-title">🗺️ The Journey Roadmap</h2>
                <div className="sc-roadmap-wrap">
                  <div className="sc-roadmap-scroll">
                  <div className="sc-roadmap-track">
                    {roadmap.length === 0 ? (
                      <p className="sc-empty-text">No roadmap available yet.</p>
                    ) : (
                      roadmap.map((week, i) => {
                        const status = weekStatuses[week.week] || (isJoined ? "locked" : week.status || "locked");
                        return (
                          <React.Fragment key={week.week}>
                            {i > 0 && <div className="sc-week-connector" />}
                            <div className="sc-week-item">
                              <div
                                className={`sc-week-circle ${status}`}
                                onClick={() => handleWeekClick(week)}
                                title={`Week ${week.week}: ${week.title}`}
                              >
                                {status === "completed" ? "✓" : status === "active" ? "🔓" : "🔒"}
                              </div>
                              <p className="sc-week-label">WEEK {week.week}</p>
                              <p className="sc-week-sublabel">{week.title}</p>
                            </div>
                          </React.Fragment>
                        );
                      })
                    )}
                  </div>
                  </div>

                  {/* Progress bar */}
                  {roadmap.length > 0 && (
                    <div className="sc-roadmap-progress-track">
                      <div
                        className="sc-roadmap-progress-fill"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Locked card */}
                {showLockedCard && !isJoined && (
                  <div className="sc-locked-card">
                    <div className="sc-locked-icon">🔒</div>
                    <h3 className="sc-locked-title">Join to Unlock Full Roadmap</h3>
                    <p className="sc-locked-desc">
                      Get access to daily workout details, exercise guides, and
                      progress tracking for each week.
                    </p>
                    <button className="sc-locked-btn" onClick={handleJoin} disabled={joining}>
                      {joining ? "Joining..." : "Join Challenge to Unlock →"}
                    </button>
                  </div>
                )}

                {/* Day breakdown */}
                {selectedWeek && isJoined && (
                  <div className="sc-days-card">
                    <h3 className="sc-days-title">
                      Week {selectedWeek.week} — {selectedWeek.title}
                    </h3>
                    <div className="sc-days-grid">
                      {(selectedWeek.days || []).map((day, i) => (
                        <div key={i} className={`sc-day-card ${day.type === "rest" ? "rest" : "workout"}`}>
                          <div className="sc-day-num">Day {day.day}</div>
                          {day.type === "rest" ? (
                            <>
                              <div className="sc-day-rest-icon">😴</div>
                              <div className="sc-day-name">Rest & Recovery</div>
                            </>
                          ) : (
                            <>
                              <div className="sc-day-name">{day.name}</div>
                              {day.sets && day.reps && (
                                <div className="sc-day-sets">{day.sets} × {day.reps}</div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* About */}
                <h2 className="sc-section-title">About the Challenge</h2>
                <p className="sc-about-text">
                  {challenge.overview?.long || challenge.description}
                </p>

                {/* Rules in overview */}
                {(challenge.rules || []).length > 0 && <RulesContent />}

                {/* Benefits in overview */}
                {(challenge.benefits || []).length > 0 && <BenefitsContent />}
              </>
            )}

            {/* ── PROGRAM RULES ── */}
            {activeTab === "programrules" && (
              <div style={{ marginTop: 0 }}>
                <RulesContent />
              </div>
            )}

            {/* ── BENEFITS ── */}
            {activeTab === "benefits" && (
              <div style={{ marginTop: 0 }}>
                <BenefitsContent />
              </div>
            )}

            {/* ── MY PROGRESS ── */}
            {activeTab === "myprogress" && (() => {
              const joinDay = toUTCDay(joinedAt || new Date());
              const completedGlobalDays = new Set(
                challengeLogs.map((log) => toUTCDay(log.date) - joinDay + 1)
              );
              const totalWorkoutDays = roadmap.reduce(
                (s, w) => s + (w.days || []).filter((d) => d.type === "workout").length, 0
              );
              let completedWorkoutDays = 0;
              for (let wi = 0; wi < roadmap.length; wi++) {
                for (const day of roadmap[wi].days || []) {
                  if (day.type === "workout" && completedGlobalDays.has(wi * 7 + day.day))
                    completedWorkoutDays++;
                }
              }
              const progressPct = totalWorkoutDays > 0
                ? Math.round((completedWorkoutDays / totalWorkoutDays) * 100) : 0;
              const totalDuration = challengeLogs.reduce((s, l) => s + (l.duration || 0), 0);
              const totalCalories = challengeLogs.reduce((s, l) => s + (l.calories || 0), 0);
              const totalSteps = challengeLogs.reduce((s, l) => s + (l.steps || 0), 0);
              const avgDuration = challengeLogs.length ? Math.round(totalDuration / challengeLogs.length) : 0;
              const avgCalories = challengeLogs.length ? Math.round(totalCalories / challengeLogs.length) : 0;
              const recentLogs = [...challengeLogs]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);
              const wStatuses = weekStatuses;

              return (
                <div className="pr-panel">
                  {/* Header */}
                  <div className="pr-header">
                    <div>
                      <h2 className="pr-title">My Progress Report</h2>
                      <p className="pr-subtitle">
                        Joined {joinedAt ? new Date(joinedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}
                      </p>
                    </div>
                    <div className="pr-pct-badge">{progressPct}%</div>
                  </div>

                  {/* Progress bar */}
                  <div className="pr-bar-wrap">
                    <div className="pr-bar-track">
                      <div className="pr-bar-fill" style={{ width: `${progressPct}%` }} />
                    </div>
                    <span className="pr-bar-label">
                      {completedWorkoutDays} of {totalWorkoutDays} workout days completed
                    </span>
                  </div>

                  {/* Stats grid */}
                  <div className="pr-stats-grid">
                    {[
                      { label: "Sessions", value: challengeLogs.length, icon: "📋" },
                      { label: "Total Duration", value: `${totalDuration} min`, icon: "⏱️" },
                      { label: "Calories Burned", value: totalCalories.toLocaleString(), icon: "🔥" },
                      { label: "Total Steps", value: totalSteps.toLocaleString(), icon: "👟" },
                      { label: "Avg Duration", value: `${avgDuration} min`, icon: "📊" },
                      { label: "Avg Calories", value: avgCalories.toLocaleString(), icon: "⚡" },
                    ].map((s) => (
                      <div key={s.label} className="pr-stat-card">
                        <div className="pr-stat-icon">{s.icon}</div>
                        <div className="pr-stat-value">{s.value}</div>
                        <div className="pr-stat-label">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Weekly breakdown */}
                  <h3 className="pr-section-title">Weekly Breakdown</h3>
                  <div className="pr-weeks-table">
                    {roadmap.map((week, wi) => {
                      const wDays = (week.days || []).filter((d) => d.type === "workout");
                      const doneDays = wDays.filter((d) => completedGlobalDays.has(wi * 7 + d.day)).length;
                      const status = wStatuses[week.week] || "locked";
                      return (
                        <div key={week.week} className={`pr-week-row ${status}`}>
                          <div className="pr-week-status-icon">
                            {status === "completed" ? "✓" : status === "active" ? "🔓" : "🔒"}
                          </div>
                          <div className="pr-week-info">
                            <span className="pr-week-name">Week {week.week} — {week.title}</span>
                            <span className="pr-week-days">{doneDays}/{wDays.length} workouts done</span>
                          </div>
                          <div className={`pr-week-badge ${status}`}>
                            {status === "completed" ? "Complete" : status === "active" ? "In Progress" : "Locked"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mood Insights */}
                  {(() => {
                    const logsWithMood = challengeLogs.filter((l) => l.sentiment);
                    if (logsWithMood.length === 0) return null;
                    const counts = logsWithMood.reduce((acc, l) => {
                      acc[l.sentiment] = (acc[l.sentiment] || 0) + 1;
                      return acc;
                    }, {});
                    return (
                      <>
                        <h3 className="pr-section-title">Mood Insights</h3>
                        <div className="pr-mood-bar">
                          {[["positive","😊","#10b981"],["neutral","😐","#f59e0b"],["negative","😔","#ef4444"]].map(([s, icon, color]) =>
                            counts[s] ? (
                              <div key={s} className="pr-mood-seg" style={{ background: color, flex: counts[s] }} title={`${counts[s]} ${s}`}>
                                {counts[s] > 1 && <span>{icon} {counts[s]}</span>}
                              </div>
                            ) : null
                          )}
                        </div>
                        <div className="pr-mood-legend">
                          {[["positive","😊"],["neutral","😐"],["negative","😔"]].map(([s, icon]) =>
                            counts[s] ? (
                              <span key={s} className={`pr-mood-tag ${s}`}>{icon} {counts[s]} {s}</span>
                            ) : null
                          )}
                        </div>
                        <div className="pr-mood-notes">
                          {logsWithMood.slice(0, 3).filter(l => l.notes).map((log) => (
                            <div key={log._id} className="pr-mood-note-row">
                              <span className="pr-mood-note-date">
                                {new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              </span>
                              <span className={`pr-mood-dot ${log.sentiment}`} />
                              <span className="pr-mood-note-text">"{log.notes}"</span>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}

                  {/* AI Progress Prediction */}
                  <h3 className="pr-section-title">AI Progress Prediction</h3>
                  {!prediction && !predLoading && (
                    <button className="pr-predict-btn" onClick={fetchPrediction}>
                      🤖 Generate Prediction
                    </button>
                  )}
                  {predLoading && (
                    <div className="pr-predict-loading">
                      <div className="ai-rec-spinner" style={{ width: 16, height: 16, borderTopColor: "#3b82f6", border: "2px solid #1e293b", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                      Gemini is analysing your progress...
                    </div>
                  )}
                  {predError && <p style={{ color: "#f87171", fontSize: 13 }}>{predError}</p>}
                  {prediction && (
                    <div className="pr-prediction-card">
                      <div className="pr-pred-top">
                        <span className={`pr-pred-likelihood ${prediction.likelihood?.toLowerCase()}`}>
                          {prediction.likelihood} Likelihood
                        </span>
                        <span className="pr-pred-date">
                          Est. completion: {new Date(prediction.completionDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      <p className="pr-pred-summary">{prediction.summary}</p>
                      {(prediction.tips || []).length > 0 && (
                        <ul className="pr-pred-tips">
                          {prediction.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                      )}
                      <button className="pr-predict-refresh" onClick={fetchPrediction} disabled={predLoading}>
                        Refresh
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── LEADERBOARD ── */}
            {activeTab === "leaderboard" && (
              <>
                <h2 className="sc-section-title" style={{ marginTop: 0 }}>
                  Challenge Leaderboard
                </h2>
                {topChallengers.length === 0 ? (
                  <div className="sc-lb-empty">No participants yet. Be the first to join!</div>
                ) : (
                  topChallengers.map((challenger, index) => {
                    const isYou = String(challenger.id) === currentUserId;
                    return (
                      <div key={challenger.id || index} className={`sc-lb-row ${isYou ? "you" : ""}`}>
                        <span className="sc-lb-rank">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                        </span>
                        <div className="sc-challenger-avatar">{getInitials(challenger.name)}</div>
                        <span className="sc-lb-name">
                          {challenger.name}
                          {isYou && <span className="sc-you-tag">(You)</span>}
                        </span>
                        <span className="sc-lb-duration">{challenger.duration || 0} min</span>
                      </div>
                    );
                  })
                )}
              </>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="sc-sidebar">

            {/* Join / Leave */}
            <div className="sc-sidebar-card">
              {!isJoined ? (
                <>
                  <button className="sc-join-btn" onClick={handleJoin} disabled={joining}>
                    {joining ? "Joining..." : "Join Challenge →"}
                  </button>
                  <p className="sc-guarantee">30-DAY SATISFACTION GUARANTEE</p>
                </>
              ) : (
                <>
                  <div className="sc-joined-badge">✓ You're In!</div>
                  <button className="sc-leave-btn" onClick={handleLeave}>Leave Challenge</button>
                </>
              )}

              <div className="sc-stats-grid">
                <div>
                  <div className="sc-stat-label">DURATION</div>
                  <div className="sc-stat-value">📅 {challenge.duration} Days</div>
                </div>
                <div>
                  <div className="sc-stat-label">SKILL LEVEL</div>
                  <div className="sc-stat-value">📊 {challenge.level}</div>
                </div>
                <div>
                  <div className="sc-stat-label">PARTICIPANTS</div>
                  <div className="sc-stat-value">👥 {(challenge.participants || 0).toLocaleString()}+</div>
                </div>
                <div>
                  <div className="sc-stat-label">EQUIP.</div>
                  <div className="sc-stat-value">🏋️ {challenge.equipment || "None"}</div>
                </div>
              </div>
            </div>

            {/* Today's Task */}
            {isJoined && (() => {
              const task = getTodayTask();
              return (
                <div className="sc-sidebar-card">
                  <p className="sc-card-title" style={{ marginBottom: "12px" }}>Today's Task</p>

                  {task ? (
                    <div className="sc-task-box">
                      <div className="sc-task-day">Day {task.dayNumber}</div>
                      {task.type === "rest" ? (
                        <div className="sc-task-name">😴 Rest & Recovery</div>
                      ) : (
                        <>
                          <div className="sc-task-name">💪 {task.name}</div>
                          {task.sets && task.reps && (
                            <div className="sc-task-sets">{task.sets} sets × {task.reps}</div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="sc-task-box">
                      <div className="sc-task-name" style={{ color: "#94a3b8" }}>Challenge complete or no task for today.</div>
                    </div>
                  )}

                  {logMsg && (
                    <div className={`sc-log-msg ${logMsg.success ? "success" : "error"}`} style={{ marginTop: "10px" }}>
                      {logMsg.text}
                    </div>
                  )}

                  {showMoodForm ? (
                    <div className="sc-mood-form">
                      <p className="sc-mood-prompt">💭 How was today's workout?</p>
                      <textarea
                        className="sc-mood-textarea"
                        rows={2}
                        value={moodText}
                        onChange={(e) => setMoodText(e.target.value)}
                        placeholder="Felt strong, great energy..."
                      />
                      <div className="sc-mood-actions">
                        <button className="sc-mood-skip" onClick={handleSkipMood}>Skip</button>
                        <button
                          className="sc-mood-save"
                          onClick={handleMoodSubmit}
                          disabled={moodSaving || !moodText.trim()}
                        >
                          {moodSaving ? "Analysing..." : "Submit"}
                        </button>
                      </div>
                    </div>
                  ) : todayLogged ? (
                    (() => {
                      const todayLog = challengeLogs.find(
                        (l) => l.date?.slice(0, 10) === new Date().toISOString().slice(0, 10)
                      );
                      const sentimentIcon = todayLog?.sentiment === "positive" ? "😊"
                        : todayLog?.sentiment === "negative" ? "😔" : todayLog?.sentiment === "neutral" ? "😐" : null;
                      return (
                        <div className="sc-today-done" style={{ marginTop: "12px" }}>
                          ✓ Completed Today {sentimentIcon && <span style={{ marginLeft: "6px" }}>{sentimentIcon}</span>}
                        </div>
                      );
                    })()
                  ) : (
                    <button
                      className="sc-log-btn"
                      style={{ marginTop: "12px" }}
                      onClick={handleMarkDone}
                      disabled={logSaving}
                    >
                      {logSaving ? "Saving..." : "Mark as Done"}
                    </button>
                  )}
                </div>
              );
            })()}

            {/* Top Challengers */}
            <div className="sc-sidebar-card">
              <div className="sc-challengers-header">
                <span className="sc-card-title">Top Challengers</span>
                <button className="sc-view-all" onClick={() => setActiveTab("leaderboard")}>
                  View All
                </button>
              </div>

              {topChallengers.length === 0 ? (
                <p className="sc-no-challengers">Be the first to join!</p>
              ) : (
                topChallengers.slice(0, 3).map((challenger, index) => {
                  const rankClass = index === 0 ? "gold" : index === 1 ? "silver" : "bronze";
                  const isYou = String(challenger.id) === currentUserId;
                  return (
                    <div key={challenger.id || index} className="sc-challenger-item">
                      <div className={`sc-rank-badge ${rankClass}`}>{index + 1}</div>
                      <div className="sc-challenger-avatar">{getInitials(challenger.name)}</div>
                      <div className="sc-challenger-info">
                        <span className="sc-challenger-name">
                          {challenger.name}
                          {isYou && <span style={{ color: "#3b82f6", marginLeft: "4px", fontSize: "11px" }}>(You)</span>}
                        </span>
                        <span className="sc-challenger-sub">
                          {challenger.duration || 0} min total
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* What's Included */}
            {(challenge.included || []).length > 0 && (
              <div className="sc-sidebar-card">
                <p className="sc-card-title" style={{ marginBottom: "14px" }}>What's Included</p>
                <div className="sc-included-list">
                  {challenge.included.map((item, i) => (
                    <div key={i} className="sc-included-item">
                      <div
                        className="sc-included-dot"
                        style={{ backgroundColor: DOT_COLORS[i % DOT_COLORS.length] }}
                      />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default SingleChallenge;
