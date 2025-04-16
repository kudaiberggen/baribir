import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/MyMemories.css";

const MyMemories = () => {
  return (
    <section>
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="mymemories-container">
        <AccountSettingsLinks />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "82%",
          }}
        >
          <h2 style={{ margin: "15px 0 15px", fontSize: "32px" }}>
            My Memories
          </h2>
          <div className="memories-container"></div>
        </div>
      </div>
    </section>
  );
};

export default MyMemories;
