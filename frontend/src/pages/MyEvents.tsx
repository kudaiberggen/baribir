import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/MyEvents.css";

const MyEvents = () => {
  return (
    <section>
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="myevents-container">
        <AccountSettingsLinks />
        <div style={{ width: "80%" }}>
          <h2 style={{ marginLeft: "20px", fontSize: "24px" }}>My Events</h2>
          <div className="events-container"></div>
        </div>
      </div>
    </section>
  );
};

export default MyEvents;
