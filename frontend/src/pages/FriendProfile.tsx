import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/FriendProfile.css";
import Phone from "../assets/myprofile/phone.png";
import EmailProfile from "../assets/myprofile/email.png";

const truncateByWords = (str: string, numWords: number) => {
  const words = str.split(" ");
  return words.length > numWords
    ? words.slice(0, numWords).join(" ") + "..."
    : str;
};

const FriendProfile = () => {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [showFullBio, setShowFullBio] = useState(false);
  const [showMoreEvents, setShowMoreEvents] = useState(false);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`/api/user/${userId}/`)
      .then((res) => setProfileData(res.data))
      .catch((err) => console.error("Failed to load profile:", err));

    axios
      .get(`/api/user/${userId}/created-events/`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to load events:", err));
  }, [userId]);

  if (!profileData) return <div>Loading...</div>;

  return (
    <section>
      <div style={{ display: "flex", flexDirection: "column", width: "82%" }}>
        <h2 style={{ margin: "15px 0", fontSize: "32px" }}>Friend's Profile</h2>
        <div className="profile-container-white">
          <div style={{ width: "60%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={profileData.avatar || "/default-avatar.png"}
                alt="Avatar"
                className="myprofile-avatar"
              />
              <div style={{ margin: "0 30px" }}>
                <h2>
                  {profileData.first_name} {profileData.last_name}
                </h2>
                <p>{profileData.city}</p>
                <p>
                  {showFullBio
                    ? profileData.bio
                    : truncateByWords(profileData.bio || "No bio", 20)}
                  {profileData.bio?.split(" ").length > 20 && (
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
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <img
                src={Phone}
                alt="Phone"
                className="myprofile-phoneemail-image"
              />
              <p>Phone: {profileData.phone || "+7..."}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={EmailProfile}
                alt="Email"
                className="myprofile-phoneemail-image"
              />
              <p>Email: {profileData.email}</p>
            </div>
            <div className="myprofile-interests-div">
              {profileData.interests.length > 0 ? (
                profileData.interests.map((interest: string, index: number) => (
                  <span className="myprofile-interests" key={index}>
                    {interest}
                  </span>
                ))
              ) : (
                <span className="myprofile-interests">No interests</span>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "40px",
              width: "40%",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h2>Events</h2>
              <h3
                style={{ fontSize: "120px", fontWeight: 500, color: "#411666" }}
              >
                {events.length}
              </h3>
            </div>
            <div style={{ textAlign: "center" }}>
              <h2>Friends</h2>
              <h3
                style={{ fontSize: "120px", fontWeight: 500, color: "#411666" }}
              >
                --
              </h3>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: "32px" }}>
            {profileData.first_name}'s events:
          </h2>
          <div className="event-cards">
            {(showMoreEvents ? events : events.slice(0, 4)).map(
              (event: any, index: number) => (
                <div className="event-card" key={index}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={event.image}
                      alt="Event"
                      className="myprofile-event-card-image"
                    />
                    <div className="myprofile-event-card-category">
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
        </div>
      </div>
    </section>
  );
};

export default FriendProfile;
