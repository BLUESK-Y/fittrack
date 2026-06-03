import React from "react";

const ChallengeFilters = ({
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty
}) => {

  const categories = ["All", "Cardio", "Strength", "Flexibility", "Endurance"];
  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  return (
    <div className="challenges-sidebar">

      <h4>CATEGORIES</h4>
      <ul>
        {categories.map((cat) => (
          <li
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>

      <h4>DIFFICULTY</h4>
      <div className="difficulty">
        {difficulties.map((level) => (
          <label key={level}>
            <input
              type="checkbox"
              checked={selectedDifficulty.includes(level)}
              onChange={() => {
                if (selectedDifficulty.includes(level)) {
                  setSelectedDifficulty(
                    selectedDifficulty.filter((d) => d !== level)
                  );
                } else {
                  setSelectedDifficulty([...selectedDifficulty, level]);
                }
              }}
            />
            {level}
          </label>
        ))}
      </div>

    </div>
  );
};

export default ChallengeFilters;