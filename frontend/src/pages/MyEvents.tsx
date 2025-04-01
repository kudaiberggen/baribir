import Header from "../components/Header";
import AccountSettingsLinks from "../components/AccountSettingsLinks";
import Footer from "../components/Footer";
import "../styles/MyEvents.css";

const MyEvents = () => {
  return (
    <div>
      <Header />
      <section>
        <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>
          Account Settings
        </h1>
        <div className="myevents-container">
          <AccountSettingsLinks />
          <div>
            <h2 style={{ marginLeft: "20px", fontSize: "24px" }}>My Events</h2>
            <div className="events-container"></div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MyEvents;
