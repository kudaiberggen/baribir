import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "/BariB1r.svg";
import "../styles/Auth.css";

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

  const [errorMessages, setErrorMessages] = useState<{ [key: string]: string }>(
    {}
  );
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessages({ ...errorMessages, [e.target.name]: "" });
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessages({});
    setSuccess("");

    let errors: { [key: string]: string } = {};

    if (formData.password !== formData.confirm_password) {
      errors.confirm_password = "Passwords do not match";
    }

    if (!validateEmail(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (formData.phone.length < 10) {
      errors.phone = "Phone number must be at least 10 digits";
    }

    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(errors).length > 0) {
      setErrorMessages(errors);
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
        setErrorMessages(
          data.error
            ? { general: data.error }
            : Object.fromEntries(Object.entries(data))
        );
      }
    } catch (error) {
      setErrorMessages({ general: "Something went wrong" });
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
            <div className="input-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errorMessages.username && (
                <p className="error right-align">{errorMessages.username}</p>
              )}
            </div>

            <div className="name-inputs">
              <div className="input-group">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  style={{ width: "170px" }}
                />
                {errorMessages.first_name && (
                  <p className="error right-align">
                    {errorMessages.first_name}
                  </p>
                )}
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  style={{ width: "170px" }}
                />
                {errorMessages.last_name && (
                  <p className="error right-align">{errorMessages.last_name}</p>
                )}
              </div>
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errorMessages.email && (
                <p className="error right-align">{errorMessages.email}</p>
              )}
            </div>

            <div className="input-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              {errorMessages.phone && (
                <p className="error right-align">{errorMessages.phone}</p>
              )}
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errorMessages.password && (
                <p className="error right-align">{errorMessages.password}</p>
              )}
            </div>

            <div className="input-group">
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
              {errorMessages.confirm_password && (
                <p className="error right-align">
                  {errorMessages.confirm_password}
                </p>
              )}
            </div>

            <button type="submit">Create account</button>

            {errorMessages.general && (
              <p className="error general">{errorMessages.general}</p>
            )}
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
