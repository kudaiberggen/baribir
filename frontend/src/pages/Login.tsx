import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Logo from "/BariB1r.svg";
import "../styles/Auth.css";

interface LoginFormState {
  username: string;
  password: string;
  rememberMe: boolean;
}

const Login: React.FC = () => {
  const [formState, setFormState] = useState<LoginFormState>({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    general?: string;
  }>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    let newErrors: { username?: string; password?: string } = {};

    if (!formState.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formState.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formState.username,
          password: formState.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login response:", data);
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("profile_image", data.profile_image);
          login();
          navigate("/");
        }
      } else {
        setErrors({ general: data.detail || "Invalid credentials" });
      }
    } catch (error) {
      console.error("Request failed:", error);
      setErrors({ general: "Server error. Please try again later." });
    }
  };

  return (
    <div className="register-container" style={{ height: "80vh" }}>
      <div className="register-box">
        <div className="register-left">
          <h1>
            WELCOME <br />
            BACK!
          </h1>
          <p>
            Find your community by <br /> your interests
          </p>
        </div>
        <div className="register-right">
          <Link to="/">
            <img src={Logo} alt="Company Logo" />
          </Link>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formState.username}
                onChange={handleInputChange}
                className={errors.username ? "input-error" : ""}
              />
              {errors.username && <p className="error">{errors.username}</p>}
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formState.password}
                onChange={handleInputChange}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <div className="remember-forgot">
              <label className="remember-me">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formState.rememberMe}
                  onChange={handleInputChange}
                />{" "}
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            {errors.general && (
              <p className="error general">{errors.general}</p>
            )}

            <button type="submit">Log in</button>
          </form>
          <p className="login-text">
            Don't have an account? <Link to="/registration">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
