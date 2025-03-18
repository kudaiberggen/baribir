import { Link } from "react-router-dom";
import Button from "./Button";
import Logo from "/BariB1r.svg";
import "../styles/Header.css";

const Header: React.FC = () => {
  return (
    <header>
      <div className="nav-container">
        <Link to="/">
          <img src={Logo} alt="Company Logo" />
        </Link>

        <nav className="flex gap-4 items-center">
          <Link to="/">Home</Link>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact us</Link>
        </nav>
        <div className="login-div">
          <Link to="/login">Log in</Link>
          <Link to="/registration">
            <Button> Create An Account </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
