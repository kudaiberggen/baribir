import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import EventDate from "../assets/aboutevent/date.png";
import Location from "../assets/aboutevent/location.png";
import Time from "../assets/aboutevent/time.png";
import TengeSymbol from "../assets/aboutevent/tenge-symbol.png";
import Heart from "../assets/aboutevent/heart.png";
import "../styles/AboutEvent.css";

interface EventPhoto {
  id: number;
  image: string;
}

interface EventType {
  id: string;
  title: string;
  description: string;
  date: string;
  city: string;
  address: string;
  photos?: EventPhoto[];
  price?: string | number | null;
  category?: string;
  author: number;
}

const AboutEvent = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [userId, setUserId] = useState<number | null>(null);
  const [event, setEvent] = useState<EventType | null>(null);
  const BASE_URL = "http://127.0.0.1:8000";

  function getUserIdFromToken(): number | null {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user_id || null;
    } catch (error) {
      return null;
    }
  }

  useEffect(() => {
    const id = getUserIdFromToken();
    setUserId(id);
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (!event) return <p>Loading...</p>;

  return (
    <div className="about-event-content">
      <div className="about-event-main">
        <div className="about-event-header">
          <div
            className="about-event-header-background"
            style={{
              backgroundImage: `url(${
                event.photos?.[0]?.image
                  ? `${BASE_URL}${event.photos[0].image}`
                  : "/default-event.jpg"
              })`,
            }}
          >
            <div className="about-event-header-overlay">
              <h1 className="about-event-title">{event.title}</h1>
              {event.category && (
                <span className="about-event-category">{event.category}</span>
              )}
            </div>
          </div>
        </div>

        <p>{event.description}</p>

        {event.photos && event.photos.length > 0 && (
          <div className="about-event-photos">
            {event.photos.map((photo) => (
              <img
                key={photo.id}
                src={`${BASE_URL}${photo.image}`}
                alt="Event"
                className="about-event-photo"
              />
            ))}
          </div>
        )}
      </div>
      <div>
        <div className="about-event-sidebar">
          <div className="about-event-info-box">
            <div className="sidebar-title-date">
              <img
                src={EventDate}
                alt="Date"
                style={{ width: "30px", height: "30px" }}
              />
              <p style={{ fontSize: "24px" }}>
                {new Date(event.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
            <div className="sidebar-flex">
              <img src={Location} alt="Location" />
              <p>
                {event.city}, {event.address}
              </p>
            </div>
            <div className="sidebar-flex">
              <img src={Time} alt="Time" />
              <p>
                {new Date(event.date).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="sidebar-flex">
              <img src={TengeSymbol} alt="Price" />
              <p>{event.price ? `${event.price} ₸` : "Free"}</p>
            </div>
            <div className="sidebar-flex">
              <img src={Heart} alt="Favorites" />
              <p>Add to Favorites</p>
            </div>
          </div>
          <div className="about-event-sidebar-buttons">
            {userId === event.author ? (
              <button className="about-event-button delete">
                Delete Event
              </button>
            ) : (
              <button className="about-event-button registration-event">
                Registration
              </button>
            )}
          </div>
        </div>
        <div className="about-event-sidebar">
          <div className="about-event-info-box">
            <div className="sidebar-title-date">
              <p style={{ fontSize: "24px" }}>Participants</p>
            </div>
            <div className="sidebar-participants">
              <img src="" alt="Participants" />
              <p></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutEvent;
