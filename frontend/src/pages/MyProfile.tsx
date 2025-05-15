import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/MyProfile.css";
import Phone from "../assets/myprofile/phone.png";
import EmailProfile from "../assets/myprofile/email.png";

type FavoriteEvent = {
  id: number;
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    city: string;
    address: string;
    author: number;
    category: string;
    photos: { image: string }[];
    announcements: any[];
    price: string;
  };
  created_at: string;
};

type AttendedEvent = {
  id: number;

  title: string;
  description: string;
  date: string;
  city: string;
  address: string;
  author: number;
  category: string;
  photos: { image: string }[];
  announcements: any[];
  price: string;
  attended_at: string;
};

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
  const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<FavoriteEvent[]>([]);
  const [showMoreEvents, setShowMoreEvents] = useState(false);
  const [showMoreFavorites, setShowMoreFavorites] = useState(false);

  const formatPrice = (price?: string | number | null): string => {
    if (price === null || price === "" || price === undefined) {
      return "Free";
    }
    return `${price} ₸`;
  };

  const formatDateTime = (isoDate: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      dateStyle: "medium",
      timeStyle: "short",
    };
    return new Date(isoDate).toLocaleString("en-GB", options);
  };

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

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("/api/events/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();
        console.log("Favorite events:", data);
        setFavoriteEvents(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchAttendedEvents = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("/api/events/attended/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch attended events");
        }

        const data = await response.json();
        console.log("Attended events:", data);
        setAttendedEvents(data);
      } catch (error) {
        console.error("Error fetching attended events:", error);
      }
    };

    fetchAttendedEvents();
  }, []);

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
                  className="myprofile-avatar"
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
                  className="myprofile-phoneemail-image"
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
                  className="myprofile-phoneemail-image"
                />
                <p>Email: {profileData?.email || "example@example.com"}</p>
              </div>
              <div className="myprofile-interests-div">
                {profileData?.interests?.length > 0 ? (
                  profileData.interests.map(
                    (interest: string, index: number) => (
                      <span className="myprofile-interests" key={index}>
                        {interest}
                      </span>
                    )
                  )
                ) : (
                  <span className="myprofile-interests">Interests</span>
                )}
              </div>
            </div>
            <div className="white-block-row">
              <div className="white-block-column">
                <h2>Events attented</h2>
                <h3 className="white-block-h3">{attendedEvents.length}</h3>
              </div>
              <div className="white-block-column">
                <h2>Favorites</h2>
                <h3 className="white-block-h3">{favoriteEvents.length}</h3>
              </div>
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: "32px" }}>Events attended</h2>
            {attendedEvents.length === 0 ? (
              <p style={{ color: "#888", marginTop: "20px" }}>
                You haven't attended any events yet.
              </p>
            ) : (
              <>
                <div className="event-cards">
                  {(showMoreEvents
                    ? attendedEvents
                    : attendedEvents.slice(0, 4)
                  ).map((attended, index) => (
                    <Link
                      to={`/events/${attended.id}`}
                      key={attended.id}
                      className="event-card"
                    >
                      <div className="event-card" key={index}>
                        <div style={{ position: "relative" }}>
                          <img
                            src={
                              attended.photos[0]
                                ? `http://localhost:8000${attended.photos[0].image}`
                                : "/default.jpg"
                            }
                            alt="Card"
                            className="myprofile-event-card-image"
                          />
                          <div className="myprofile-event-card-category">
                            {attended.category}
                          </div>
                        </div>
                        <h3>{attended.title}</h3>
                        <p>
                          {attended.city}, {attended.address}
                        </p>
                        <p>{formatDateTime(attended.date)}</p>
                        <p>{formatPrice(attended.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                {attendedEvents.length > 4 && (
                  <button
                    onClick={() => setShowMoreEvents(!showMoreEvents)}
                    className="show-more-button"
                  >
                    {showMoreEvents ? "Show less" : "Show more"}
                  </button>
                )}
              </>
            )}
            <h2 style={{ fontSize: "32px" }}>Favorites</h2>
            {favoriteEvents.length === 0 ? (
              <p style={{ color: "#888", marginTop: "20px" }}>
                You don't have any favorites.
              </p>
            ) : (
              <>
                <div className="event-cards">
                  {(showMoreFavorites
                    ? favoriteEvents
                    : favoriteEvents.slice(0, 4)
                  ).map((fav, index) => (
                    <Link
                      to={`/events/${fav.event.id}`}
                      key={fav.event.id}
                      className="event-card"
                    >
                      <div className="event-card" key={index}>
                        <div style={{ position: "relative" }}>
                          <img
                            src={fav.event.photos[0]?.image || "/default.jpg"}
                            alt="Card"
                            className="myprofile-event-card-image"
                          />
                          <div className="myprofile-event-card-category">
                            {fav.event.category}
                          </div>
                        </div>
                        <h3>{fav.event.title}</h3>
                        <p>
                          {fav.event.city}, {fav.event.address}
                        </p>
                        <p>{formatDateTime(fav.event.date)}</p>
                        <p>{formatPrice(fav.event.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                {favoriteEvents.length > 4 && (
                  <button
                    onClick={() => setShowMoreFavorites(!showMoreFavorites)}
                    className="show-more-button"
                  >
                    {showMoreFavorites ? "Show less" : "Show more"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyProfile;
