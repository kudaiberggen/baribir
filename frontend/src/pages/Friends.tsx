import { useState } from "react";
import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/Friends.css";
import SearchIcon from "../assets/home/search.svg";

import QWE from "../assets/myprofile/phone.png";

const recommendations = [
  {
    name: "Anel Yernazar",
    username: "@_anyeol",
    interests: ["Art", "Sport", "Music"],
  },
  {
    name: "Sayat Bazarbay",
    username: "@sayatemespin",
    interests: ["Tennis", "Media", "Relaxing"],
  },
  {
    name: "Aruzhan K.",
    username: "@aruka",
    interests: ["Design", "Dance", "Books"],
  },
  {
    name: "Timur Y.",
    username: "@timka",
    interests: ["Travel", "Sport", "Gaming"],
  },
  {
    name: "Diana M.",
    username: "@didi",
    interests: ["Music", "Yoga", "Fashion"],
  },
];

const Friends = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = () => {
    console.log("Search triggered for:", searchQuery);
  };

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const handleNext = () => {
    if (startIndex < recommendations.length - 3) setStartIndex(startIndex + 1);
  };

  const cardWidth = 290;

  return (
    <section className="settings-section">
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="myfriends-container">
        <AccountSettingsLinks />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "82%",
          }}
        >
          <h2 style={{ margin: "15px 0 0", fontSize: "32px" }}>Friends</h2>
          <div className="friends-container">
            <div className="search-friends">
              <p>All(6)</p>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
              </div>
            </div>
            <div className="friends-main">
              <div className="friend-image">
                <img src={QWE} alt="Friend's Avatar" />
              </div>
              <div className="friend-bio">
                <h3>Sayat Bazarbay</h3>
                <p>@sayatemespin, Almaty</p>
                <p>
                  Sayat Bazarbay Ryan is a 21-year-old medical student who
                  enjoys tennis, social media and relaxing. He is brave and
                  energetic, but can also be very disloyal and a bit rude.
                </p>
                <div className="friend-tags">
                  <span>Art</span>
                  <span>Sport</span>
                  <span>Entertainment</span>
                </div>
              </div>
              <div className="friend-buttons">
                <button>Following</button>
                <button>View profile</button>
              </div>
            </div>

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
                        <img src={QWE} alt="Avatar" className="avatar" />
                        <h4 style={{ margin: "10px 0", fontSize: "18px" }}>
                          {user.name}
                        </h4>
                        <p style={{ margin: "0", fontSize: "14px" }}>
                          {user.username}
                        </p>
                        <div className="tags">
                          {user.interests.map((interest, i) => (
                            <span key={i}>{interest}</span>
                          ))}
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
