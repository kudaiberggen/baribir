import Header from "../components/Header";
import AccountSettingsLinks from "../components/AccountSettingsLinks";
import Footer from "../components/Footer";
import "../styles/MyMemories.css";

const MyMemories = () => {
  return (
    <section>
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="mymemories-container">
        <AccountSettingsLinks />
        <div>
          <h2 style={{ marginLeft: "20px", fontSize: "24px" }}>My Memories</h2>
          <div className="memories-container"></div>
        </div>
      </div>
    </section>
  );
};

export default MyMemories;
