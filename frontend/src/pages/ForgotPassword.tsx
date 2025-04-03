import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "/BariB1r.svg";
import "../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/password-reset/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Server error");
      }

      const data = await response.json();
      setTemporaryPassword(data.temporary_password);
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="forgotpassword-section">
      <div className="forgotpassword-container">
        <Link to="/">
          <img src={Logo} alt="Company Logo" />
        </Link>
        <h2 style={{ fontSize: "28px", fontWeight: "400" }}>Forgot Password</h2>
        <p style={{ color: "#6C6C6C" }}>
          Enter your username to recover access to your account.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button type="submit">Reset password</button>
        </form>

        {temporaryPassword && (
          <div>
            <p>
              Your temporary password:{" "}
              <span style={{ color: "red" }}>{temporaryPassword}</span>
            </p>
          </div>
        )}
        <p>
          Forgot your username? Contact the{" "}
          <a href="#" style={{ textDecoration: "none", color: "#411666" }}>
            Server administrator
          </a>
        </p>
        <Link to="/login" style={{ textDecoration: "none", color: "#6C6C6C" }}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
