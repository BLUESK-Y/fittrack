import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logo } from "../../assets";
import api from "../../services/api";
import NotificationBell from "../Notifications/NotificationBell";
import "./navbar.css";

const AppNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) {
      // proceed even if request fails
    }
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="app-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard" className="brand">
          <img src={logo} className="brand-icon" alt="logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto nav-links">
            <Nav.Link as={Link} to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/leaderboard" className={location.pathname === "/leaderboard" ? "active" : ""}>
              Leaderboard
            </Nav.Link>
            <Nav.Link as={Link} to="/challenges" className={location.pathname === "/challenges" ? "active" : ""}>
              Challenges
            </Nav.Link>
            <Nav.Link as={Link} to="/ai-coach" className={location.pathname === "/ai-coach" ? "active" : ""}>
              AI Coach
            </Nav.Link>
            {user?.role === "admin" && (
              <Nav.Link as={Link} to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
                Admin
              </Nav.Link>
            )}
          </Nav>

          <div className="nav-right">
            {user && <NotificationBell />}
            <div className="profile-circle">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <a className="logout-btn" onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </a>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
