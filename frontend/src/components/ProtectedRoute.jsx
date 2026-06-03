import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/landing";
import Dashboard from "../features/dashboard/Dashboard";
import Challenges from "../features/challenges/Challenges";
import Leaderboard from "../features/leaderboard/Leaderboard";
import AICoach from "../features/aiCoach/AICoach";
import SingleChallenge from "../features/challenges/SingleChallenge/SingleChallenge";
import AdminPanel from "../features/admin/AdminPanel";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const raw = localStorage.getItem("user");
  if (!raw) return <Navigate to="/" replace />;
  const user = JSON.parse(raw);
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
      <Route path="/challenges/:id" element={<ProtectedRoute><SingleChallenge /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
      <Route path="/ai-coach" element={<ProtectedRoute><AICoach /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
    </Routes>
  );
};

export default AppRoutes;