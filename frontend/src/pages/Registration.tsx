import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "/BariB1r.svg";
import "../styles/Registration.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Invalid email format");
      return;
    }

    if (formData.phone.length < 10) {
      setError("Phone number must be at least 10 digits");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    console.log("Form data being sent:", formData);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response from server:", data);
      if (response.ok) {
        setSuccess("Account created successfully!");
      } else {
        setError(
          data.error ? data.error : Object.values(data).flat().join(", ")
        );
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-left">
          <h1>WELCOME!</h1>
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
              value={formData.username}
              onChange={handleChange}
              required
            />
            <div className="name-inputs">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
            <button type="submit">Create account</button>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
          </form>
          <p className="login-text">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
