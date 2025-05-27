import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
  const { friendId } = useParams();
  const [profileData, setProfileData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [isFriend, setIsFriend] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [showMoreEvents, setShowMoreEvents] = useState(false);

  useEffect(() => {
    if (!friendId) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get(`/api/users/${friendId}/`, { headers })
      .then((res) => {
        setProfileData(res.data);
        setFriends(res.data.friends || []);
      })
      .catch((err) => console.error("Failed to load profile:", err));

    axios
      .get(`/api/friends/is_friend/${friendId}/`, { headers })
      .then((res) => {
        setIsFriend(res.data.is_friend);
      })
      .catch((err) => console.error("Failed to check friendship:", err));

    axios
      .get(`/api/user/${friendId}/created-events/`, { headers })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to load events:", err));
  }, [friendId]);

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

  const handleFollow = async () => {
    try {
      await axios.post(`/api/friends/request/${friendId}/`);
      setIsFriend(true);
    } catch (err) {
      console.error("Failed to send friend request:", err);
    }
  };

  const handleUnfollow = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.post(
        `http://localhost:8000/api/user/${friendId}/unfollow/`,
        {},
        { headers }
      );

      setIsFriend(false);
    } catch (err) {
      console.error("Failed to remove friend:", err);
    }
  };

  if (!profileData) return <div>Loading...</div>;
  return (
    <section>
      <div className="friend-profile-container">
        <div className="friend-profile-container-white">
          <div style={{ width: "60%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={
                  profileData.profile_image
                    ? `http://localhost:8000${profileData.profile_image}`
                    : "/default-avatar.png"
                }
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
                profileData.interests.map((interest: any, index: number) => (
                  <span className="myprofile-interests" key={index}>
                    {interest.name}
                  </span>
                ))
              ) : (
                <span className="myprofile-interests">No interests</span>
              )}
            </div>
            {isFriend ? (
              <button
                className="white-block-unfollow-button"
                onClick={handleUnfollow}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="white-block-follow-button"
                onClick={handleFollow}
              >
                + Follow
              </button>
            )}
          </div>
          <div className="white-block-row">
            <div className="white-block-column">
              <h2>Events</h2>
              <h3 className="white-block-h3">{events.length}</h3>
            </div>
            <div className="white-block-column">
              <h2>Friends</h2>
              <h3 className="white-block-h3">{friends.length}</h3>
            </div>
          </div>
        </div>
        <hr
          style={{
            width: "100%",
            border: "none",
            borderTop: "1px solid #e0e0e0",
            margin: "50px 0",
          }}
        />
        <div>
          <h2 style={{ fontSize: "32px", textAlign: "left" }}>
            {profileData.first_name}'s events:
          </h2>
          <div className="event-cards">
            {(showMoreEvents ? events : events.slice(0, 4)).map(
              (event: any, index: number) => (
                <Link
                  to={`/events/${event.id}`}
                  key={event.id}
                  className="event-card"
                >
                  <div className="event-card" key={index}>
                    <div style={{ position: "relative" }}>
                      <img
                        src={
                          event.photos?.[0]?.image?.startsWith("http")
                            ? event.photos[0].image
                            : `http://localhost:8000${event.photos?.[0]?.image}`
                        }
                        alt="Event"
                        className="myprofile-event-card-image"
                      />
                      <div className="myprofile-event-card-category">
                        {event.category}
                      </div>
                    </div>
                    <h3>{event.title}</h3>
                    <p>
                      {event.city}, {event.address}
                    </p>
                    <p>{formatDateTime(event.date)}</p>
                    <p>{formatPrice(event.price)}</p>
                  </div>
                </Link>
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
