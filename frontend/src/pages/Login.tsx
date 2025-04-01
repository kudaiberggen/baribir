import { Link } from "react-router-dom";
import Logo from "/BariB1r.svg";
import "../styles/Login.css";

const Login = () => {
  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-left">
          <h1>
            WELCOME <br />
            BACK!
          </h1>
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
            <input type="text" placeholder="Password" />
            <div className="remember-forgot">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>
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
