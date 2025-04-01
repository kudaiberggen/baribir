import { Link } from "react-router-dom";
import Logo from "/BariB1r.svg";
import "../styles/Registration.css";

const Register = () => {
  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-left">
          <h1>WELCOME!</h1>
          <p>
            Find your community by <br></br>your interests
          </p>
        </div>
        <div className="register-right">
          <Link to="/">
            <img src={Logo} alt="Company Logo" />
          </Link>
          <form>
            <input type="text" placeholder="Username" />
            <div className="name-inputs">
              <input type="text" placeholder="First Name" />
              <input type="text" placeholder="Last Name" />
            </div>
            <input type="email" placeholder="Email" />
            <input type="tel" placeholder="Phone Number" />
            <input type="text" placeholder="Password" />
            <input type="text" placeholder="Confirm Password" />
            <button type="submit">Create account</button>
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
