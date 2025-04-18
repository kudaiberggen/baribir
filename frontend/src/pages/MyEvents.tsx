import React, { useState, useEffect } from "react";
import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/MyEvents.css";

const MyEvents = () => {
  const [activeTab, setActiveTab] = useState<string>("myevents");
  const handleTabClick = (tab: string) => setActiveTab(tab);
  const [myEvents, setMyEvents] = useState([]);
  const [showMoreMyevents, setShowMoreMyevents] = useState(false);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await fetch("/api/myevents");
        const data = await response.json();
        setMyEvents(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchMyEvents();
  }, []);

  return (
    <section>
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="myevents-container">
        <AccountSettingsLinks />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "82%",
          }}
        >
          <h2 style={{ margin: "15px 0 15px", fontSize: "32px" }}>My Events</h2>
          <div className="myevents-tabs">
            <a
              href="#myevents"
              className={activeTab === "myevents" ? "myevents-active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("myevents");
              }}
            >
              My events
            </a>
            <a
              href="#upcomingevents"
              className={
                activeTab === "upcomingevents" ? "myevents-active" : ""
              }
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("upcomingevents");
              }}
            >
              Upcoming events
            </a>
          </div>

          <div className="myevents-tab-content">
            {activeTab === "myevents" && (
              <div className="myevents-tab-pane">
                {/* <div className="event-cards">
                  {(showMoreMyevents ? myEvents : myEvents.slice(0, 4)).map(
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
                    )
                  )}
                </div> */}
                {myEvents.length > 4 && (
                  <button
                    onClick={() => setShowMoreMyevents(!showMoreMyevents)}
                    className="show-more-button"
                  >
                    {showMoreMyevents ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            )}
            {activeTab === "upcomingevents" && (
              <div className="myevents-tab-pane">
                <h2>Уведом</h2>
                <p>Настройки уведомлений.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyEvents;
