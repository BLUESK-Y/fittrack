import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./CalenderView.css";

const CalendarView = () => {
  const [logs, setLogs] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchLogs();
  }, [currentDate]);

  const fetchLogs = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      const res = await api.get(`/logs?userId=${user.id || user._id}`);
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const isLoggedDay = (day) =>
    logs.some((log) => {
      const logDate = new Date(log.date);
      return (
        logDate.getFullYear() === year &&
        logDate.getMonth() === month &&
        logDate.getDate() === day
      );
    });

  const changeMonth = (direction) =>
    setCurrentDate(new Date(year, month + direction, 1));

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="empty" />);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(
      <div key={`day-${i}`} className={`day ${isLoggedDay(i) ? "active" : ""}`}>
        {i}
      </div>
    );
  }

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <h4>Activity Log</h4>
        <div className="calendar-arrows">
          <span onClick={() => changeMonth(-1)}>‹</span>
          <span onClick={() => changeMonth(1)}>›</span>
        </div>
      </div>

      <p className="month-title">{monthName}</p>

      <div className="weekdays">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, index) => (
          <div key={`${d}-${index}`}>{d}</div>
        ))}
      </div>

      <div className="calendar-grid">{days}</div>
    </div>
  );
};

export default CalendarView;
