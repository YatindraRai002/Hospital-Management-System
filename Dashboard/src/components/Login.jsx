import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { Context } from "../main";
import axios from "axios";
import { FaUser, FaLock, FaUserShield } from "react-icons/fa";
import API_BASE_URL from "../config/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      enqueueSnackbar("Please fill in all fields", { variant: "error" });
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/login`,
        { email, password, role: "Admin" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      
      enqueueSnackbar(response.data.message, { variant: "success" });
      setIsAuthenticated(true);
      navigateTo("/");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <div className="admin-icon">
                <FaUserShield />
              </div>
              <h1 className="login-title">Admin Dashboard</h1>
              <p className="login-subtitle">Welcome back! Please sign in to continue.</p>
              <p className="admin-notice">Only authorized administrators can access this panel.</p>
            </div>
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <div className="input-icon">
                  <FaUser />
                </div>
                <input
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  required
                />
              </div>
              
              <div className="input-group">
                <div className="input-icon">
                  <FaLock />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  required
                />
              </div>
              
              <button type="submit" className="login-button">
                Sign In to Dashboard
              </button>
            </form>
            
            <div className="login-footer">
              <p>🔒 Secure admin access to AURACARE Hospital Management System</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;