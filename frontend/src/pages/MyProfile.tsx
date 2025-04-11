import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/MyProfile.css";

const MyProfile = () => {
  return (
    <section>
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="myprofile-container">
        <AccountSettingsLinks />
        <div style={{ width: "80%" }}>
          <h2 style={{ marginLeft: "20px", fontSize: "24px" }}>My Profile</h2>
          <div className="profile-container"></div>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;
