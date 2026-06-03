import React from "react";
import { useNavigate } from "react-router-dom";

const ChallengeCard = ({ challenge, isJoined = false }) => {
  const navigate = useNavigate();
  const challengeId = challenge._id || challenge.id;

  return (
    <div className="challenge-card" onClick={() => navigate(`/challenges/${challengeId}`)}>
      <div className="challenge-image">
        <img
          src={challenge.image}
          alt={challenge.title}
          onError={(e) => {
            e.target.src = "https://placehold.co/400x250?text=FitTrack";
          }}
        />
        {challenge.tag && (
          <span className={`challenge-tag ${challenge.tag.toLowerCase()}`}>
            {challenge.tag}
          </span>
        )}
        {isJoined && <span className="challenge-joined-badge">✓ Joined</span>}
      </div>

      <div className="challenge-content">
        <div className="challenge-category">{challenge.category}</div>
        <h3 className="challenge-title">{challenge.title}</h3>

        <div className="challenge-meta">
          <span>⏱ {challenge.duration} Days</span>
          <span>🎯 {challenge.level}</span>
          {challenge.points && <span>⭐ {challenge.points} pts</span>}
        </div>

        <button
          className={`join-btn ${isJoined ? "joined" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/challenges/${challengeId}`);
          }}
        >
          {isJoined ? "✓ Joined" : "Join Challenge →"}
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;
