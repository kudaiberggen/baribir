import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/Friends.css";

const Friends = () => {
  return (
    <section>
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="myfriends-container">
        <AccountSettingsLinks />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "82%",
          }}
        >
          <h2 style={{ margin: "15px 0 15px", fontSize: "32px" }}>
            My Friends
          </h2>
          <div className="friends-container"></div>
        </div>
      </div>
    </section>
  );
};

export default Friends;
