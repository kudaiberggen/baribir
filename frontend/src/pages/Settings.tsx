import Header from "../components/Header";
import AccountSettingsLinks from "../components/AccountSettingsLinks";
import Footer from "../components/Footer";
import "../styles/Settings.css";

const Settings = () => {
  return (
    <section>
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="mysettings-container">
        <AccountSettingsLinks />
        <div>
          <h2 style={{ marginLeft: "20px", fontSize: "24px" }}>Settings</h2>
          <div className="settings-container"></div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
