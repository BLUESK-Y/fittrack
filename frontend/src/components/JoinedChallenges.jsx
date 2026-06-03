import React, { useEffect, useState } from "react";
import api from "../services/api";
import ChallengeCard from "../features/challenges/ChallengeCard";
import "./JoinedChallenges.css";

const JoinedChallenges = () => {
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoinedChallenges = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;
        const userId = user.id || user._id;

        const res = await api.get(`/user-challenges?userId=${userId}`);
        const records = Array.isArray(res.data) ? res.data : [];

        // Only active challenges; challengeId is populated with full challenge data
        const active = records
          .filter((r) => r.status === "active" && r.challengeId)
          .map((r) => r.challengeId);

        setJoinedChallenges(active);
      } catch (error) {
        console.error("Error fetching joined challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedChallenges();
  }, []);

  return (
    <div className="joined-section">
      <h2>My Joined Challenges</h2>

      {loading ? (
        <p className="joined-empty">Loading...</p>
      ) : joinedChallenges.length === 0 ? (
        <p className="joined-empty">You haven't joined any challenges yet.</p>
      ) : (
        <div className="joined-grid">
          {joinedChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge._id || challenge.id}
              challenge={challenge}
              isJoined={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JoinedChallenges;
