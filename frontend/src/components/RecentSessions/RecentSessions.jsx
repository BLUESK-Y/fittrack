import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./RecentSessions.css";

const workoutEmoji = {
  Cardio: "🏃",
  Running: "👟",
  Cycling: "🚴",
  Strength: "🏋️",
  Yoga: "🧘",
};

const WORKOUT_TYPES = ["Cardio", "Running", "Cycling", "Strength", "Yoga"];

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const SessionCard = ({ log, onEdit }) => (
  <div className="session-card">
    <div className="session-emoji">{workoutEmoji[log.workoutType] || "💪"}</div>
    <div className="session-left">
      <h4>{log.workoutType}</h4>
      <p>
        {formatDate(log.date)} • {log.duration} mins • {log.calories} kcal
        {log.steps ? ` • ${log.steps.toLocaleString()} steps` : ""}
      </p>
    </div>
    <div className="session-status">
      <span className="completed">✓ Done</span>
      <small>{log.time}</small>
      <button className="session-edit-btn" onClick={() => onEdit(log)}>Edit</button>
    </div>
  </div>
);

const RecentSessions = ({ onRefresh }) => {
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchLogs = async () => {
    console.log("fetchLogs called");
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("user from localStorage:", user);
      if (!user) return;
      const res = await api.get(`/logs?userId=${user.id || user._id}`);
      console.log("RAW RESPONSE:", res.data);
      const sorted = [...(Array.isArray(res.data) ? res.data : [])]
        .filter((l) => !l.challengeId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log("SORTED LOGS:", sorted);
      setAllLogs(sorted);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    console.log("RecentSessions mounted");
    fetchLogs(); }, []);

  const openEdit = (log) => {
    setEditingLog(log);
    setEditForm({
      date: log.date?.slice(0, 10) || "",
      workoutType: log.workoutType || "",
      duration: log.duration || "",
      calories: log.calories || "",
      steps: log.steps || "",
    });
    setEditError("");
  };

  const closeEdit = () => { setEditingLog(null); setEditError(""); };

  const handleEditChange = (e) =>
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editForm.workoutType || !editForm.duration || !editForm.calories) {
      setEditError("Workout type, duration, and calories are required.");
      return;
    }
    setSaving(true);
    setEditError("");
    try {
      await api.put(`/logs/${editingLog._id}`, {
        date: editForm.date,
        workoutType: editForm.workoutType,
        duration: Number(editForm.duration),
        calories: Number(editForm.calories),
        steps: Number(editForm.steps) || 0,
      });
      closeEdit();
      fetchLogs();
      if (onRefresh) onRefresh();
    } catch (err) {
      setEditError(err?.response?.data?.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const visibleLogs = allLogs.slice(0, 3);

  return (
    <div className="recent-section">
      <div className="recent-header">
        <h2>Recent Sessions</h2>
        {allLogs.length > 3 && (
          <button className="view-all-btn" onClick={() => setShowAll(true)}>
            View All
          </button>
        )}
      </div>

      {loading ? (
        <p className="empty-text">Loading...</p>
      ) : allLogs.length === 0 ? (
        <p className="empty-text">No sessions logged yet.</p>
      ) : (
        visibleLogs.map((log) => (
          <SessionCard key={log._id || log.id} log={log} onEdit={openEdit} />
        ))
      )}

      {/* View All Modal */}
      {showAll && (
        <div className="session-modal-overlay" onClick={() => setShowAll(false)}>
          <div className="session-modal session-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="session-modal-header">
              <h3>All Sessions ({allLogs.length})</h3>
              <button className="session-modal-close" onClick={() => setShowAll(false)}>×</button>
            </div>
            <div className="session-all-list">
              {allLogs.map((log) => (
                <SessionCard key={log._id || log.id} log={log} onEdit={(l) => { setShowAll(false); openEdit(l); }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingLog && (
        <div className="session-modal-overlay" onClick={closeEdit}>
          <div className="session-modal" onClick={(e) => e.stopPropagation()}>
            <div className="session-modal-header">
              <h3>Edit Session</h3>
              <button className="session-modal-close" onClick={closeEdit}>×</button>
            </div>
            <form onSubmit={handleEditSave} className="session-edit-form">
              {editError && <div className="session-edit-error">{editError}</div>}
              <div className="session-edit-row">
                <label>Date
                  <input type="date" name="date" value={editForm.date} onChange={handleEditChange} />
                </label>
                <label>Workout Type
                  <select name="workoutType" value={editForm.workoutType} onChange={handleEditChange}>
                    <option value="">Select</option>
                    {WORKOUT_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </label>
              </div>
              <div className="session-edit-row">
                <label>Duration (min)
                  <input type="number" name="duration" min="1" value={editForm.duration} onChange={handleEditChange} />
                </label>
                <label>Calories
                  <input type="number" name="calories" min="0" value={editForm.calories} onChange={handleEditChange} />
                </label>
                <label>Steps
                  <input type="number" name="steps" min="0" value={editForm.steps} onChange={handleEditChange} />
                </label>
              </div>
              <div className="session-edit-actions">
                <button type="button" className="session-edit-cancel" onClick={closeEdit}>Cancel</button>
                <button type="submit" className="session-edit-save" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentSessions;
