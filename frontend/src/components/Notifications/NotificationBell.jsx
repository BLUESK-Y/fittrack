import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./NotificationBell.css";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("dismissedNotifs") || "[]"); }
    catch { return []; }
  });
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchNotifications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;
      const uid = user.id || user._id;
      const today = new Date().toISOString().slice(0, 10);

      const [ucRes, logsRes] = await Promise.all([
        api.get(`/user-challenges?userId=${uid}`),
        api.get(`/logs?userId=${uid}`),
      ]);

      const active = (Array.isArray(ucRes.data) ? ucRes.data : []).filter(
        (r) => r.status === "active" && r.challengeId
      );
      const todayChallengeLogs = (Array.isArray(logsRes.data) ? logsRes.data : []).filter(
        (l) => l.challengeId && l.date?.slice(0, 10) === today
      );

      const notifs = [];

      if (active.length === 0) {
        notifs.push({
          id: "no-challenges",
          icon: "🎯",
          type: "warning",
          message: "You haven't joined any challenges yet!",
          sub: "Browse challenges and start your fitness journey.",
          href: "/challenges",
        });
      } else {
        const loggedIds = new Set(todayChallengeLogs.map((l) => String(l.challengeId)));
        for (const uc of active) {
          const cid = String(uc.challengeId?._id || uc.challengeId);
          if (!loggedIds.has(cid)) {
            notifs.push({
              id: `pending-${cid}`,
              icon: "⏰",
              type: "reminder",
              message: `Pending log: "${uc.challengeId?.title || "Challenge"}"`,
              sub: "Mark today's task as done to keep your streak going.",
              href: `/challenges/${cid}`,
            });
          }
        }
      }

      setNotifications(notifs);
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  };

  const dismiss = (id, e) => {
    e.stopPropagation();
    const next = [...dismissed, id];
    setDismissed(next);
    sessionStorage.setItem("dismissedNotifs", JSON.stringify(next));
  };

  const visible = notifications.filter((n) => !dismissed.includes(n.id));
  const count = visible.length;

  return (
    <div className="notif-wrap" ref={ref}>
      <button className="notif-bell" onClick={() => setOpen((o) => !o)} aria-label="Notifications">
        🔔
        {count > 0 && <span className="notif-badge">{count}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <span>Notifications</span>
            {count > 0 && (
              <button
                className="notif-clear-all"
                onClick={() => {
                  const all = notifications.map((n) => n.id);
                  setDismissed(all);
                  sessionStorage.setItem("dismissedNotifs", JSON.stringify(all));
                }}
              >
                Clear all
              </button>
            )}
          </div>

          {visible.length === 0 ? (
            <div className="notif-empty">
              <span>✅</span>
              <p>All caught up!</p>
            </div>
          ) : (
            <div className="notif-list">
              {visible.map((n) => (
                <div
                  key={n.id}
                  className={`notif-item ${n.type}`}
                  onClick={() => { setOpen(false); navigate(n.href); }}
                >
                  <span className="notif-item-icon">{n.icon}</span>
                  <div className="notif-item-body">
                    <p className="notif-item-msg">{n.message}</p>
                    <p className="notif-item-sub">{n.sub}</p>
                  </div>
                  <button
                    className="notif-item-dismiss"
                    onClick={(e) => dismiss(n.id, e)}
                    aria-label="Dismiss"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
