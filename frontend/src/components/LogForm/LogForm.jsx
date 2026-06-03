import React, { useState } from "react";
import api from "../../services/api";
import Modal from "../../components/Modal/Modal";
import "./LogForm.css";

const LogForm = ({ onLogged }) => {
  const [formData, setFormData] = useState({
    date: "",
    workoutType: "",
    duration: "",
    calories: "",
    steps: "",
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, success: false, message: "" });

  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setModal({ open: true, success: false, message: "You must be logged in." });
      return;
    }

    setLoading(true);
    try {
      await api.post("/logs", {
        date: formData.date,
        workoutType: formData.workoutType,
        duration: Number(formData.duration),
        calories: Number(formData.calories),
        steps: Number(formData.steps) || 0,
      });

      setModal({ open: true, success: true, message: "Your workout has been saved." });
      setFormData({ date: "", workoutType: "", duration: "", calories: "", steps: "" });
      if (onLogged) onLogged();
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong. Please try again.";
      setModal({ open: true, success: false, message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="log-card">
        <h3 className="log-title">Quick Log Workout</h3>

        <form onSubmit={handleSubmit} className="log-form">
          <div className="log-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>

          <div className="log-group">
            <label>Workout Type</label>
            <select name="workoutType" value={formData.workoutType} onChange={handleChange} required>
              <option value="">Select Workout</option>
              <option value="Cardio">Cardio</option>
              <option value="Running">Running</option>
              <option value="Cycling">Cycling</option>
              <option value="Strength">Strength</option>
              <option value="Yoga">Yoga</option>
            </select>
          </div>

          <div className="log-group">
            <label>Duration (min)</label>
            <input type="number" name="duration" value={formData.duration} onChange={handleChange} required min="1" />
          </div>

          <div className="log-group">
            <label>Calories Burned</label>
            <input type="number" name="calories" value={formData.calories} onChange={handleChange} required min="0" />
          </div>

          <div className="log-group">
            <label>Steps</label>
            <input type="number" name="steps" value={formData.steps} onChange={handleChange} min="0" />
          </div>

          <button type="submit" className="log-btn" disabled={loading}>
            {loading ? "Logging..." : "Log Session"}
          </button>
        </form>
      </div>

      <Modal isOpen={modal.open} onClose={() => setModal({ ...modal, open: false })}>
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div style={{ fontSize: "52px", marginBottom: "16px" }}>
            {modal.success ? "✅" : "❌"}
          </div>
          <h2 className="modal-title">
            {modal.success ? "Logged Successfully!" : "Logging Failed"}
          </h2>
          <p className="modal-subtitle">{modal.message}</p>
          <button className="modal-btn" onClick={() => setModal({ ...modal, open: false })}>
            {modal.success ? "Great!" : "Close"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default LogForm;
