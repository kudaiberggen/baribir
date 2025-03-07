import Button from "./Button";
import SearchInput from "./SearchInput";
import Logo from "/icon.svg";
import "../styles/Header.css";

const Header: React.FC = () => {
  return (
    <header>
      <div className="nav-container">
        <a href="/">
          <img src={Logo} alt="Company Logo" />
        </a>
        <SearchInput />

        <nav className="flex gap-4 items-center">
          <a href="#">Home</a>
          <a href="#">Contact</a>
          <a href="#">About us</a>
          <a href="#">Log in</a>

          <Button> Create An Account </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
