import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRoutes from "./components/ProtectedRoute"
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App