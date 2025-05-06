import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/Friends.css";
import SearchIcon from "../assets/home/search.svg";
import axios from "axios";

const cardWidth = 300;

const Friends = () => {
  const BASE_URL = "http://localhost:8000";
  const [startIndex, setStartIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchFriendsAndRecommendations = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [friendsRes, recsRes] = await Promise.all([
          axios.get("/api/friends/", config),
          axios.get("/api/friends/recommendations/", config),
        ]);

        setFriends(friendsRes.data);
        setRecommendations(recsRes.data);
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriendsAndRecommendations();
  }, []);

  const handleSearch = () => {
    console.log("Search triggered for:", searchQuery);
  };

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const handleNext = () => {
    if (startIndex < recommendations.length - 3) setStartIndex(startIndex + 1);
  };

  console.log("Recommendations:", recommendations);

  return (
    <section className="settings-section">
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="myfriends-container">
        <AccountSettingsLinks />
        <div style={{ display: "flex", flexDirection: "column", width: "82%" }}>
          <h2 style={{ margin: "15px 0 0", fontSize: "32px" }}>Friends</h2>
          <div className="friends-container">
            <div className="search-friends">
              <p>
                All(
                <span style={{ fontWeight: "bold" }}>{friends.length}</span>)
              </p>
              <div className="search-input-wrapper">
                <button
                  onClick={handleSearch}
                  className="search-icon-button"
                  type="button"
                >
                  <img src={SearchIcon} alt="Search" />
                </button>
                <input
                  type="text"
                  placeholder="Search friends"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

            {isLoading ? (
              <p>Loading friends...</p>
            ) : friends.length === 0 ? (
              <p style={{ marginTop: "20px", fontSize: "18px" }}>
                You don't have any friends yet.
              </p>
            ) : (
              friends.map((friend, index) => (
                <div key={index} className="friends-main">
                  <div className="friend-image">
                    <img
                      src={
                        friend.profile_image
                          ? `${BASE_URL}${friend.profile_image}`
                          : ""
                      }
                      alt="Friend's Avatar"
                    />
                  </div>
                  <div className="friend-bio">
                    <h3>
                      {friend.first_name || "Firstname"}{" "}
                      {friend.last_name || "Lastname"}
                    </h3>
                    <p>
                      @{friend.username}
                      {friend.city ? `, ${friend.city}` : ""}
                    </p>
                    <p>{friend.bio || "No bio available."}</p>
                    <div className="friend-tags">
                      {(friend.interests || []).map((int: any, i: number) => (
                        <span key={i}>{int.name}</span>
                      ))}
                    </div>
                  </div>
                  <div className="friend-buttons">
                    <a href="">Following</a>
                    <Link to={`/friend/${friend.id}`} key={friend.id}>
                      View profile
                    </Link>
                  </div>
                </div>
              ))
            )}

            <div className="recommendation-slider">
              <h3 style={{ fontSize: "24px" }}>Recommendations for you</h3>
              <div className="slider-controls">
                <button onClick={handlePrev} className="arrow-button">
                  ‹
                </button>
                <div className="slider-window">
                  <div
                    className="slider-track"
                    style={{
                      transform: `translateX(-${startIndex * cardWidth}px)`,
                    }}
                  >
                    {recommendations.map((user, index) => (
                      <div key={index} className="recommendation-card">
                        <img
                          src={
                            user.profile_image
                              ? `${BASE_URL}${user.profile_image}`
                              : ""
                          }
                          alt="Avatar"
                          className="avatar"
                        />
                        <h4 style={{ margin: "10px 0", fontSize: "18px" }}>
                          {user.first_name || "Firstname"}{" "}
                          {user.last_name || "Lastname"}
                        </h4>
                        <p style={{ margin: "0", fontSize: "14px" }}>
                          @{user.username}
                        </p>
                        <div className="tags">
                          {(user.interests || []).map(
                            (interest: any, i: number) => (
                              <span key={i}>{interest.name}</span>
                            )
                          )}
                        </div>
                        <button className="follow-btn">+ Follow</button>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={handleNext} className="arrow-button">
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Friends;
