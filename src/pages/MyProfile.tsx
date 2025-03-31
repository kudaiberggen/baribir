// import { Link } from "react-router-dom";
import Header from "../components/Header";
import AccountSettingsLinks from "../components/AccountSettingsLinks";
import Footer from "../components/Footer";
import "../styles/MyProfile.css";

const MyProfile = () => {
  return (
    <div>
      <Header />
      <section>
        <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>
          Account Settings
        </h1>
        <div className="myprofile-container">
          <AccountSettingsLinks />
          <div>
            <h2 style={{ marginLeft: "20px", fontSize: "24px" }}>My Profile</h2>
            <div className="profile-container"></div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MyProfile;
