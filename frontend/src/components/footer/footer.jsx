import React from "react";
import "./footer.css";
import {logo} from "../../assets"

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">

        <div className="footer-left">
          <img src={logo} alt="" />
          <p>Track. Compete. Improve.</p>
        </div>

        <div className="footer-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/challenges">Challenges</a>
          <a href="/leaderboard">Leaderboard</a>
          <a href="/ai-coach">AI Coach</a>
        </div>

        <div className="footer-right">
          <p>© 2026 FitTrack</p>
          <span>All rights reserved.</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;