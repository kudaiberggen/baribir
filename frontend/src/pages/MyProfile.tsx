import React, { useState, useEffect } from "react";
import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/MyProfile.css";
import Phone from "../assets/myprofile/phone.png";
import EmailProfile from "../assets/myprofile/email.png";

const MyProfile = () => {
  const [profileImage, setProfileImage] = useState<string>(() => {
    return (
      localStorage.getItem("profile_image") ||
      "/media/profile_images/default.png"
    );
  });

  const [showFullBio, setShowFullBio] = useState(false);

  const truncateByWords = (text: string, maxWords: number): string => {
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ");
  };

  const [profileData, setProfileData] = useState<any>(null);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [showMoreEvents, setShowMoreEvents] = useState(false);
  const [showMoreFavorites, setShowMoreFavorites] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("/api/user-with-settings/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        console.log("Fetched user data:", data);
        setProfileData(data);

        if (data.profile_image) {
          const baseUrl = "http://localhost:8000";
          setProfileImage(`${baseUrl}${data.profile_image}`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // useEffect(() => {
  //   const fetchFavorites = async () => {
  //     try {
  //       const token = localStorage.getItem("access_token");
  //       const response = await fetch("/api/favorites", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch favorites");
  //       }

  //       const data = await response.json();
  //       setFavoriteEvents(data);
  //     } catch (error) {
  //       console.error("Error fetching favorites:", error);
  //     }
  //   };

  //   fetchFavorites();
  // }, []);

  const events = [
    {
      title: "«Гарри Поттер и Философский Камень»",
      description:
        "4000 тенге, 22 марта в 20:00, 22:00, Стендап клуб Almaty Central Stand up club, ул.Кабанбай Батыра, 71",
      image: Phone,
      category: "Кино",
    },
    {
      title: "«Гарри Поттер и Философский Камень»",
      description:
        "4000 тенге, 22 марта в 20:00, 22:00, Стендап клуб Almaty Central Stand up club, ул.Кабанбай Батыра, 71",
      image: Phone,
      category: "Стендап",
    },
    {
      title: "«Гарри Поттер и Философский Камень»",
      description:
        "4000 тенге, 22 марта в 20:00, 22:00, Стендап клуб Almaty Central Stand up club, ул.Кабанбай Батыра, 71",
      image: Phone,
      category: "Стендап",
    },
    {
      title: "«Гарри Поттер и Философский Камень»",
      description:
        "4000 тенге, 22 марта в 20:00, 22:00, Стендап клуб Almaty Central Stand up club, ул.Кабанбай Батыра, 71",
      image: Phone,
      category: "Стендап",
    },
    {
      title: "«Гарри Поттер и Философский Камень»",
      description:
        "4000 тенге, 22 марта в 20:00, 22:00, Стендап клуб Almaty Central Stand up club, ул.Кабанбай Батыра, 71",
      image: Phone,
      category: "Стендап",
    },
  ];

  return (
    <section className="settings-section">
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="myprofile-container">
        <AccountSettingsLinks />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "82%",
          }}
        >
          <h2 style={{ margin: "15px 0 15px", fontSize: "32px" }}>
            My Profile
          </h2>
          <div className="profile-container-white">
            <div style={{ width: "60%" }}>
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
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2px solid #411666",
                    flexShrink: 0,
                  }}
                />
                <div style={{ margin: "0 30px 0 30px" }}>
                  <h2>
                    {profileData?.first_name || "Firstname"}{" "}
                    {profileData?.last_name || "Lastname"}
                  </h2>
                  <p>{profileData?.city || "City"}</p>
                  <p>
                    {showFullBio
                      ? profileData?.bio
                      : truncateByWords(profileData?.bio || "Bio", 20)}
                    {(profileData?.bio?.split(" ").length > 20 || false) && (
                      <span
                        onClick={() => setShowFullBio(!showFullBio)}
                        style={{
                          color: "#8E8ECE",
                          cursor: "pointer",
                          marginLeft: "8px",
                        }}
                      >
                        {showFullBio ? "Hide" : "...Read more"}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px 0 0",
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
                <p>Phone: {profileData?.phone || "+7..."}</p>
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
                <p>Email: {profileData?.email || "example@example.com"}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "0",
                }}
              >
                {profileData?.interests || "Interests"}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "40px",
                width: "40%",
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
            <div className="event-cards">
              {(showMoreEvents ? events : events.slice(0, 4)).map(
                (event, index) => (
                  <div className="event-card" key={index}>
                    <div style={{ position: "relative" }}>
                      <img
                        src={event.image}
                        alt="Card"
                        style={{
                          borderRadius: "12px",
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "10px",
                          backgroundColor: "#411666",
                          color: "#fff",
                          padding: "5px 10px",
                          borderRadius: "12px",
                          fontSize: "14px",
                          zIndex: 2,
                        }}
                      >
                        {event.category}
                      </div>
                    </div>
                    <h3>{event.title}</h3>
                    <p style={{ color: "#ABABAB" }}>{event.description}</p>
                  </div>
                )
              )}
            </div>
            {events.length > 4 && (
              <button
                onClick={() => setShowMoreEvents(!showMoreEvents)}
                className="show-more-button"
              >
                {showMoreEvents ? "Show less" : "Show more"}
              </button>
            )}
            <h2 style={{ fontSize: "32px" }}>Favorites</h2>
            {/* <div className="event-cards">
              {(showMoreFavorites
                ? favoriteEvents
                : favoriteEvents.slice(0, 4)
              ).map((event, index) => (
                <div className="event-card" key={index}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={event.image}
                      alt="Card"
                      style={{
                        borderRadius: "12px",
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        backgroundColor: "#411666",
                        color: "#fff",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        zIndex: 2,
                      }}
                    >
                      {event.category}
                    </div>
                  </div>
                  <h3>{event.title}</h3>
                  <p style={{ color: "#ABABAB" }}>{event.description}</p>
                </div>
              ))}
            </div> */}
            {favoriteEvents.length > 4 && (
              <button
                onClick={() => setShowMoreFavorites(!showMoreFavorites)}
                className="show-more-button"
              >
                {showMoreFavorites ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;
