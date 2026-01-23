import React, { useState } from "react";
import "./LoginPage.css";
import loginImg from "../assets/Secure login-rafiki.svg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../api/authApi";
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const response = await fetch("http://localhost:5000/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       toast.error(data.message || "Login failed");
  //       setLoading(false);
  //       return;
  //     }

  //     //TOKEN STORE (MOST IMPORTANT)
  //     localStorage.setItem("token", data.token);
  //     localStorage.setItem("role", data.role);
  //     localStorage.setItem("user_id", data.user_id);

  //     toast.success("Login successful");

  //     //ROLE BASED REDIRECT
  //     if (data.role === "admin") {
  //       navigate("/admin/dashboard");
  //     } else {
  //       navigate("/employee/dashboard");
  //     }

  //   } catch (error) {
  //     toast.error("Server error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { data } = await loginUser({ email, password });

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("user_id", data.user_id);

    toast.success("Login successful");

    navigate(
      data.role === "admin"
        ? "/admin/dashboard"
        : "/employee/dashboard"
    );
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="login-container">
      <h1 className="title">WorkForceX Attendance System</h1>

      <div className="login-card">
        {/* Left Illustration */}
        <div className="left-side">
          <img src={loginImg} alt="illustration" className="illustration" />
        </div>

        {/* Right Form */}
        <div className="right-side">
          <h2 className="login-text">LOGIN</h2>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="input-box"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
