import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data, status } = await api.post("/login", { email, password });

      if (status === 200 && data.token) {
        localStorage.setItem("token", data.token);
        setEmail("");
        setPassword("");
        navigate("/admin");
      } else {
        setError("Invalid credentials or server error.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        setError(
          err.response.status === 403
            ? "Your account is blocked"
            : err.response.status === 401
            ? "Invalid email or password"
            : "An unexpected error occurred. Please try again."
        );
      } else {
        setError("Could not connect to the server. Please try again.");
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "28rem" }}>
        <h1 className="text-center mb-3">The App</h1>
        <h2 className="h5 text-center mb-4">Sign In to The App</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="floatingInput">Email Address</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <div className="mb-3 form-check">
            <input type="checkbox" className="form-check-input" id="rememberMe" />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember me
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Sign In
          </button>
      </form>
        <p className="text-center mt-3">
          Don’t have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
