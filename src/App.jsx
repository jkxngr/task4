import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/LoginForm";
import UserManagement from "./components/UserManagement";
import RegistrationForm from "./components/RegistrationForm";

const App = () => {
  const token = localStorage.getItem("token"); 

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route
          path="/admin"
          element={
            token ? <UserManagement /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
