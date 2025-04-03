import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Logo from "/BariB1r.svg";
import "../styles/Login.css";

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

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

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
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        login();
        navigate("/");
      } else {
        setErrorMessage(data.detail || "Invalid credentials");
      }
    } catch (error) {
      setErrorMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="register-container">
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
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formState.username}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formState.password}
              onChange={handleInputChange}
            />
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
            {errorMessage && <p className="error-message">{errorMessage}</p>}
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
