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
          <Link to="/contact">Contact us</Link>
          <Link to="/about">About us</Link>
          <Link to="/login">Log in</Link>

          <Button> Create An Account </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
