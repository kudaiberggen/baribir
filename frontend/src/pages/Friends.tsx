import Header from "../components/Header";
import AccountSettingsLinks from "../components/AccountSettingsLinks";
import Footer from "../components/Footer";
import "../styles/Friends.css";

const Friends = () => {
  return (
    <section>
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="myfriends-container">
        <AccountSettingsLinks />
        <div>
          <h2 style={{ marginLeft: "20px", fontSize: "24px" }}>My Friends</h2>
          <div className="friends-container"></div>
        </div>
      </div>
    </section>
  );
};

export default Friends;
