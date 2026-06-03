import React, { useEffect, useState } from "react";
import api from "../../services/api";
import ChallengeCard from "./ChallengeCard";
import ChallengeFilters from "../../components/ChallengeFilters";
import SearchBar from "../../components/SearchBar";
import "./challenges.css";
import AppNavbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";

const Challenges = () => {
  const [allChallenges, setAllChallenges] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [aiRecs, setAiRecs] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const itemsPerPage = 6;

  const fetchAiRecs = async () => {
    setAiLoading(true);
    setAiError("");
    setAiRecs([]);
    try {
      const res = await api.post("/ai/recommend-challenges");
      setAiRecs(Array.isArray(res.data) ? res.data : []);
    } catch {
      setAiError("Could not fetch recommendations. Try again.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await api.get("/challenges");
      setAllChallenges(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedDifficulty, sortBy]);

  let filtered = [...allChallenges];

  if (selectedCategory !== "All") {
    filtered = filtered.filter(
      (c) => c.category && c.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  if (selectedDifficulty.length > 0) {
    filtered = filtered.filter((c) => selectedDifficulty.includes(c.level));
  }

  if (search.trim() !== "") {
    filtered = filtered.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (sortBy === "popular") {
    filtered.sort((a, b) => (b.points || 0) - (a.points || 0));
  }

  if (sortBy === "duration") {
    filtered.sort((a, b) => b.duration - a.duration);
  }

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedChallenges = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <AppNavbar />
      <div className="challenges-page">
        <ChallengeFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
        />

        <div className="challenges-content">
          <SearchBar
            search={search}
            setSearch={setSearch}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* AI Recommendations */}
          <div className="ai-rec-section">
            <div className="ai-rec-header">
              <div>
                <h3 className="ai-rec-title">✨ AI Recommended For You</h3>
                <p className="ai-rec-sub">Personalised picks based on your workout history</p>
              </div>
              <button className="ai-rec-btn" onClick={fetchAiRecs} disabled={aiLoading}>
                {aiLoading ? "Analysing..." : aiRecs.length ? "Refresh" : "Get Recommendations"}
              </button>
            </div>

            {aiError && <p className="ai-rec-error">{aiError}</p>}

            {aiLoading && (
              <div className="ai-rec-loading">
                <div className="ai-rec-spinner" />
                <span>Gemini is analysing your fitness profile...</span>
              </div>
            )}

            {!aiLoading && aiRecs.length > 0 && (
              <div className="ai-rec-grid">
                {aiRecs.map(({ challenge, reason }) => (
                  <div key={challenge._id} className="ai-rec-card-wrap">
                    <ChallengeCard challenge={challenge} />
                    <div className="ai-rec-reason">
                      <span className="ai-rec-reason-icon">🤖</span>
                      {reason}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <h2 className="browse-title">Browse Challenges</h2>

          <div className="challenges-grid">
            {paginatedChallenges.length > 0 ? (
              paginatedChallenges.map((challenge) => (
                <ChallengeCard key={challenge._id || challenge.id} challenge={challenge} />
              ))
            ) : (
              <p className="no-results">No challenges found.</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <span onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>Previous</span>
              {[...Array(totalPages)].map((_, i) => (
                <span
                  key={i}
                  className={currentPage === i + 1 ? "active-page" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </span>
              ))}
              <span onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>Next</span>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Challenges;
