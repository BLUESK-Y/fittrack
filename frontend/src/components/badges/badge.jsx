import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./badge.css";

import earlyPlain from "../../assets/badges/early riser-b.svg";
import earlyGlow from "../../assets/badges/early riser-g.svg";
import hydrationPlain from "../../assets/badges/hydration-b.svg";
import hydrationGlow from "../../assets/badges/hydration-g.svg";
import peakPlain from "../../assets/badges/peak performer-b.svg";
import peakGlow from "../../assets/badges/peak performer-g.svg";
import flexibilityPlain from "../../assets/badges/flexibility-b.svg";
import flexibilityGlow from "../../assets/badges/flexibility-g.svg";
import consistencyPlain from "../../assets/badges/consistency-b.svg";
import consistencyGlow from "../../assets/badges/consistency-g.svg";
import nightPlain from "../../assets/badges/Night owl-b.svg";
import nightGlow from "../../assets/badges/Night owl-g.svg";

const BADGE_ICONS = {
  "Early Riser":       { glow: earlyGlow,       plain: earlyPlain },
  "Hydration Hero":    { glow: hydrationGlow,    plain: hydrationPlain },
  "Peak Performer":    { glow: peakGlow,         plain: peakPlain },
  "Flexibility King":  { glow: flexibilityGlow,  plain: flexibilityPlain },
  "Consistency King":  { glow: consistencyGlow,  plain: consistencyPlain },
  "Night Owl Workout": { glow: nightGlow,         plain: nightPlain },
  "Night Owl":         { glow: nightGlow,         plain: nightPlain },
};

const Badge = () => {
  const [allBadges, setAllBadges] = useState([]);
  const [earnedIds, setEarnedIds] = useState(new Set());

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    const userId = user.id || user._id;

    try {
      const [allRes, earnedRes] = await Promise.all([
        api.get("/badges"),
        api.get(`/badges/user/${userId}`),
      ]);

      const all = Array.isArray(allRes.data) ? allRes.data : [];
      const earned = Array.isArray(earnedRes.data) ? earnedRes.data : [];

      setAllBadges(all);
      setEarnedIds(new Set(earned.map((ub) => String(ub.badgeId?._id || ub.badgeId))));
    } catch (err) {
      console.error(err);
    }
  };

  const badgeList = allBadges.map((badge) => {
    const icons = BADGE_ICONS[badge.name] || { glow: peakGlow, plain: peakPlain };
    const achieved = earnedIds.has(String(badge._id || badge.id));
    return { ...badge, achieved, ...icons };
  });

  const sorted = [...badgeList].sort((a, b) => Number(b.achieved) - Number(a.achieved));

  return (
    <div className="badge-card">
      <h4>Badge Achievements</h4>
      <div className="badge-grid">
        {sorted.map((badge) => (
          <div
            key={badge._id || badge.name}
            className={`badge-item ${badge.achieved ? "unlocked" : "locked"}`}
          >
            <img src={badge.achieved ? badge.glow : badge.plain} alt={badge.name} />
            <p>{badge.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badge;
