import React, { useState, useEffect } from "react";
import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/MyProfile.css";
import Phone from "../assets/phone.png";
import EmailProfile from "../assets/email_profile.png";

const MyProfile = () => {
  const [profileImage, setProfileImage] = useState<string>(() => {
    return (
      localStorage.getItem("profile_image") ||
      "/media/profile_images/default.png"
    );
  });

  return (
    <section>
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="myprofile-container">
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
            My Profile
          </h2>
          <div className="profile-container-white">
            <div style={{ width: "50%" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <img
                  src={profileImage}
                  alt="Current avatar"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    border: "2px solid #411666",
                  }}
                />
                <div style={{ margin: "0 30px 0 30px" }}>
                  <h2>Yelzhas Kudaibergen</h2>
                  <p>Kazakhstan, Almaty</p>
                  <p>I'm looking for friends to go to the cinema</p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "20px 0 0 0",
                }}
              >
                <img
                  src={Phone}
                  alt="Phone"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    margin: "0 10px 0 0",
                  }}
                />
                <p>Phone: +77055055505</p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "0",
                }}
              >
                <img
                  src={EmailProfile}
                  alt="Email"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    margin: "0 10px 0 0",
                  }}
                />
                <p>Email: test@gmail.com</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "40px",
                width: "50%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <h2>Events attented</h2>
                <h3
                  style={{
                    fontSize: "120px",
                    fontWeight: "500",
                    margin: "0",
                    color: "#411666",
                  }}
                >
                  6
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                }}
              >
                <h2>Favorites</h2>
                <h3
                  style={{
                    fontSize: "120px",
                    fontWeight: "500",
                    margin: "0",
                    color: "#411666",
                  }}
                >
                  5
                </h3>
              </div>
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: "32px" }}>Events attended</h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;
