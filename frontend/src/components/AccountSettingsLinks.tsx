import { NavLink } from "react-router-dom";
import "../styles/AccountSettingsLinks.css";

const AccountSettingsLinks: React.FC = () => {
  return (
    <div className="accountlinks-container">
      <NavLink to="/my-profile" className="account-links">
        My Profile
      </NavLink>
      <NavLink to="/my-events" className="account-links">
        My Events
      </NavLink>
      <NavLink to="/friends" className="account-links">
        Friends
      </NavLink>
      <NavLink to="/settings" className="account-links">
        Settings
      </NavLink>
    </div>
  );
};

export default AccountSettingsLinks;
