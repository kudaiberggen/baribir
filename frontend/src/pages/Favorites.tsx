import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/Favorites.css";

const Favorites = () => {
  return (
    <section>
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="myfavorites-container">
        <AccountSettingsLinks />
        <div style={{ width: "80%" }}>
          <h2 style={{ marginLeft: "20px", fontSize: "24px" }}>Favorites</h2>
          <div className="favorites-container"></div>
        </div>
      </div>
    </section>
  );
};

export default Favorites;
