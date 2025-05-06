import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/MyEvents.css";

interface EventPhoto {
  id: number;
  image: string;
}

interface EventType {
  id: string;
  title: string;
  description: string;
  photos?: EventPhoto[];
  category?: string;
  city: string;
  address: string;
  date: string;
  price?: string | number | null;
}

const MyEvents = () => {
  const [activeTab, setActiveTab] = useState<"myevents" | "upcomingevents">(
    "myevents"
  );
  const [myEvents, setMyEvents] = useState<EventType[]>([]);
  const [showMoreMyevents, setShowMoreMyevents] = useState(false);

  const handleTabClick = (tab: "myevents" | "upcomingevents") => {
    setActiveTab(tab);
  };

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
    const fetchMyEvents = async () => {
      try {
        const response = await fetch("/api/profile/my-events/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const data = await response.json();
        console.log("My Events Data:", data);
        setMyEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchMyEvents();
  }, []);

  return (
    <section className="settings-section">
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="myevents-container">
        <AccountSettingsLinks />
        <div style={{ display: "flex", flexDirection: "column", width: "82%" }}>
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
                {myEvents.length === 0 ? (
                  <p style={{ color: "#888", marginTop: "20px" }}>
                    You haven't created any events yet.
                  </p>
                ) : (
                  <>
                    <div className="event-cards">
                      {(showMoreMyevents ? myEvents : myEvents.slice(0, 4)).map(
                        (event, index) => (
                          <Link
                            to={`/events/${event.id}`}
                            key={event.id}
                            className="event-card"
                          >
                            <div>
                              <div style={{ position: "relative" }}>
                                <img
                                  src={
                                    event.photos && event.photos.length > 0
                                      ? `http://127.0.0.1:8000${event.photos[0].image}`
                                      : "/default-event.jpg"
                                  }
                                  alt="Event"
                                  className="myprofile-event-card-image"
                                />
                                <div className="myprofile-event-card-category">
                                  {event.category || "General"}
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

                    {myEvents.length > 4 && (
                      <button
                        onClick={() => setShowMoreMyevents(!showMoreMyevents)}
                        className="show-more-button"
                      >
                        {showMoreMyevents ? "Show less" : "Show more"}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "upcomingevents" && (
              <div className="myevents-tab-pane">
                <p style={{ color: "#888", marginTop: "20px" }}>
                  Upcoming events will go here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyEvents;
