import React from "react";

const SearchBar = ({ search, setSearch, sortBy, setSortBy }) => {
  return (
    <div className="top-controls">
      <input
        type="text"
        placeholder="Search challenges (e.g., HIIT, Yoga)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-dropdown"
      >
        <option value="popular">Sort by: Popular</option>
        <option value="duration">Sort by: Duration</option>
      </select>
    </div>
  );
};

export default SearchBar;