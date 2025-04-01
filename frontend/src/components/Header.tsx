import { NavLink } from "react-router-dom";
import Logo from "/BariB1r.svg";
import "../styles/Header.css";

const Header: React.FC = () => {
  return (
    <header>
      <div className="nav-container">
        <NavLink to="/">
          <img src={Logo} alt="Company Logo" />
        </NavLink>

        <nav className="flex gap-4 items-center">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About us
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact us
          </NavLink>
        </nav>

        <div className="login-div">
          <NavLink to="/login" className="nav-link">
            Log in
          </NavLink>
          <NavLink to="/registration" className="registration-link">
            Create An Account
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
