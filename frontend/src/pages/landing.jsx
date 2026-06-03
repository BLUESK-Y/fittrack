import React, { useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import {
  logo,
  joinChallengeIcon,
  usersIcon,
  landingPageImage,activeChallengesTrophyIcon,currentStreakFireIcon,activeChallengesIcon,currentStreakIcon,totalWorkoutsDumbellIcon,totalWorkoutsIcon,
  realTimeTrackingIcon,personalisedGoalsIcon,leaderBoardIcon
} from "../assets";
import "./landing.css";
import Modal from "../components/Modal/Modal";
import LoginModal from "../features/auth/Login/LoginModal";
import SignupModal from "../features/auth/Signup/SignupModal";

function Landing() {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <Navbar1
        onLoginClick={() => {
          setIsLogin(true);
          setOpen(true);
        }}
        onSignupClick={() => {
          setIsLogin(false);
          setOpen(true);
        }}
      />

      <HeroSection onLoginClick={() => { setIsLogin(true); setOpen(true); }} />
      <StatsSection />
      <WhySection />
      <CTASection onLoginClick={() => { setIsLogin(true); setOpen(true); }} />

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        {isLogin ? (
          <LoginModal
            switchToSignup={() => setIsLogin(false)}
            onSuccess={() => setOpen(false)}
          />
        ) : (
          <SignupModal
            switchToLogin={() => setIsLogin(true)}
            onSuccess={() => setOpen(false)}
          />
        )}
      </Modal>
      <footer className="app-footer">
            <div className="footer-container">
      
              <div className="footer-left">
                <img src={logo} alt="" />
                <p>Track. Compete. Improve.</p>
              </div>
      
              <div className="footer-links">
                <a href="/">Dashboard</a>
                <a href="/">Challenges</a>
                <a href="/">Leaderboard</a>
                <a href="/">AI Coach</a>
              </div>
      
              <div className="footer-right">
                <p>© 2026 FitTrack</p>
                <span>All rights reserved.</span>
              </div>
      
            </div>
          </footer>
      
    </>
  );
}

/* NAVBAR */
const Navbar1 = ({ onLoginClick, onSignupClick }) => (
  <Navbar expand="lg" className="custom-navbar px-4">
    <Container fluid>
      <Navbar.Brand>
        <img src={logo} alt="logo" />
      </Navbar.Brand>

      <Navbar.Toggle />

      <Navbar.Collapse>
        <Nav className="mx-auto nav-links">
          <Nav.Link  className="navl" onClick={onLoginClick}>Challenges</Nav.Link>
          <Nav.Link  className="navl" onClick={onLoginClick}>Leaderboards</Nav.Link>
          <Nav.Link  className="navl" onClick={onLoginClick}>AI Coach</Nav.Link>
        </Nav>

        <div className="d-flex gap-3 align-items-center">
          <Nav.Link className="login-link" onClick={onLoginClick}>
            Login
          </Nav.Link>
          <Button className="signup-btn" onClick={onSignupClick}>
            Sign Up
          </Button>
        </div>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

/* HERO */
const HeroSection = ({ onLoginClick }) => (
  <section className="heroSection">
    <div className="container heroContainer">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <div className="live">
            <span className="liveDot"></span>
            Live Challenges Now Active
          </div>

          <h1 className="tagLine">
            Push Your <span className="colorChange">Limits.</span>
            <br />
            Track Your Progress.
          </h1>

          <p className="TgBody">
            Join thousands of athletes in global fitness challenges.
            Track every rep, run, and ride with precision.
          </p>

          <div className="d-flex gap-3 mt-4">
            <button className="joinchallengeBtn" onClick={onLoginClick}>
              Join Challenge
              <img src={joinChallengeIcon} alt="" width="18" />
            </button>

            <button className="exploreCommunitybtn" onClick={onLoginClick}>
              Explore Leaderboard
            </button>
          </div>

          <div className="joined mt-4">
            <img src={usersIcon} alt="" height="40" />
            <span>Joined by 20,000+ athletes worldwide</span>
          </div>
        </div>

        <div className="col-lg-6 text-center">
          <div className="imageContainer">
            <img src={landingPageImage} alt="" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* STATS SECTION */
const StatsSection = () => (
  <section className="statsSection">
    <div className="container">
      <div className="row g-4">
        <div className="col-md-4">
          <div className="statCard">
            <img src={activeChallengesTrophyIcon} alt="" />
            <h5>Active Challenges</h5>
            <h2>128 Open Now</h2>
            <img src={activeChallengesIcon} alt="" />
          </div>
        </div>
        <div className="col-md-4">
          <div className="statCard">
            <img src={currentStreakFireIcon} alt="" />
            <h5>Current Streak</h5>
            <h2>15 Days</h2>
            <img src={currentStreakIcon} alt="" />
          </div>
        </div>
        <div className="col-md-4">
          <div className="statCard">
            <img src={totalWorkoutsDumbellIcon} alt="" />
            <h5>Total Workouts</h5>
            <h2>1.2M+ Done</h2>
            <img src={totalWorkoutsIcon} alt="" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* WHY SECTION */
const WhySection = () => (
  <section className="whySection">
    <div className="container">
      <h2>Why Choose FitTrack?</h2>
      <div className="row g-4 mt-4">
        <div className="col-md-4">
          <div className="whyCard">
            <img src={realTimeTrackingIcon} alt="" />
            <h4>Real-time Tracking</h4>
            <p>Monitor every rep and step with precision.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="whyCard">
            <img src={personalisedGoalsIcon} alt="" />
            <h4>Global Leaderboards</h4>
            <p>Compete with fitness enthusiasts worldwide.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="whyCard">
            <img src={leaderBoardIcon} alt="" />
            <h4>Personalized Goals</h4>
            <p>Dynamic challenges tailored for you.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* CTA */
const CTASection = ({ onLoginClick }) => (
  <section className="ctaSection">
    <div className="container text-center">
      <div className="ctaBox">
        <h2>Ready to transform your fitness journey?</h2>
        <p>Join the next global sprint challenge.</p>
        <div className="d-flex justify-content-center gap-3 mt-3">
          <button className="primaryBtn" onClick={onLoginClick}>Get Started Now</button>
          <button className="secondaryBtn" onClick={onLoginClick}>Learn More</button>
        </div>
      </div>
    </div>
  </section>

  
);

export default Landing;