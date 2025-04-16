import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/Favorites.css";

const Favorites = () => {
  return (
    <section>
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="myfavorites-container">
        <AccountSettingsLinks />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "82%",
          }}
        >
          <h2 style={{ margin: "15px 0 15px", fontSize: "32px" }}>Favorites</h2>
          <div className="favorites-container"></div>
        </div>
      </div>
    </section>
  );
};

export default Favorites;
