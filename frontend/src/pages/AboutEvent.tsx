// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";

// import EventDate from "../assets/aboutevent/date.png";
// import Location from "../assets/aboutevent/location.png";
// import Time from "../assets/aboutevent/time.png";
// import TengeSymbol from "../assets/aboutevent/tenge-symbol.png";
// import AddToFavorites from "../assets/aboutevent/add_to_favorites.png";
// import InFavorites from "../assets/aboutevent/in_favorites.png";
// import "../styles/AboutEvent.css";

// interface EventPhoto {
//   id: number;
//   image: string;
// }

// interface EventType {
//   id: string;
//   title: string;
//   description: string;
//   date: string;
//   city: string;
//   address: string;
//   photos?: EventPhoto[];
//   price?: string | number | null;
//   category?: string;
//   author: any;
// }

// const AboutEvent = () => {
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [startIndex, setStartIndex] = useState(0);
//   const { eventId } = useParams<{ eventId: string }>();
//   const [userId, setUserId] = useState<number | null>(null);
//   const [event, setEvent] = useState<EventType | null>(null);
//   const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
//   const getImageUrl = (imagePath: string) => {
//     return imagePath.startsWith("http") ? imagePath : `${BASE_URL}${imagePath}`;
//   };
//   const BASE_URL = "http://127.0.0.1:8000";
//   const navigate = useNavigate();
//   const [recommendedEvents, setRecommendedEvents] = useState<EventType[]>([]);
//   const [participants, setParticipants] = useState<any[]>([]);
//   const [isSubscribed, setIsSubscribed] = useState(false);

//   useEffect(() => {
//     const fetchParticipants = async () => {
//       try {
//         const response = await fetch(`/api/event/${eventId}/participants/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//         });
//         const data = await response.json();
//         setParticipants(data);
//         const currentUserId = getUserIdFromToken();
//         const subscribed = data.some((p: any) => p.user.id === currentUserId);
//         setIsSubscribed(subscribed);
//       } catch (error) {
//         console.error("Error fetching participants:", error);
//       }
//     };

//     if (eventId) {
//       fetchParticipants();
//     }
//   }, [eventId]);

//   const subscribeToEvent = async () => {
//     try {
//       const response = await fetch(`/api/event/${eventId}/subscribe/`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//         },
//       });

//       if (response.ok) {
//         setIsSubscribed(true);
//         const updated = await response.json();
//         console.log(updated.message);
//         const res = await fetch(`/api/event/${eventId}/participants/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//         });
//         setParticipants(await res.json());
//       }
//     } catch (error) {
//       console.error("Error subscribing to event:", error);
//     }
//   };

//   const unsubscribeFromEvent = async () => {
//     try {
//       const response = await fetch(`/api/event/${eventId}/unsubscribe/`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//         },
//       });

//       if (response.ok) {
//         setIsSubscribed(false);
//         const res = await fetch(`/api/event/${eventId}/participants/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//         });
//         setParticipants(await res.json());
//       }
//     } catch (error) {
//       console.error("Error unsubscribing from event:", error);
//     }
//   };

//   const handleDelete = async () => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this event?"
//     );
//     if (!confirmed) return;

//     try {
//       const response = await fetch(`/api/event/${eventId}/delete/`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//         },
//       });

//       const responseText = await response.text();

//       if (response.status === 204) {
//         alert("Event deleted successfully.");
//         navigate("/events");
//       } else {
//         console.error("Delete failed", response.status, responseText);
//         alert(`Error ${response.status}: ${responseText}`);
//       }
//     } catch (error) {
//       console.error("Error deleting event:", error);
//       alert("An unexpected error occurred.");
//     }
//   };

//   function getUserIdFromToken(): number | null {
//     const token = localStorage.getItem("access_token");
//     if (!token) return null;

//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return payload.user_id || null;
//     } catch (error) {
//       return null;
//     }
//   }

//   useEffect(() => {
//     const id = getUserIdFromToken();
//     setUserId(id);
//     console.log("User ID:", id);
//   }, []);

//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         const response = await fetch(`/api/event/${eventId}/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//         });
//         const data = await response.json();
//         setEvent(data);
//       } catch (error) {
//         console.error("Error fetching event:", error);
//       }
//     };

//     fetchEvent();
//   }, [eventId]);

//   useEffect(() => {
//     const fetchRecommendedEvents = async () => {
//       try {
//         const response = await fetch(`/api/event/${eventId}/other/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//         });
//         const data = await response.json();
//         setRecommendedEvents(data);
//       } catch (error) {
//         console.error("Error fetching recommended events:", error);
//       }
//     };

//     fetchRecommendedEvents();
//   }, []);

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       try {
//         const response = await fetch("/api/events/favorites", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//         });
//         const data = await response.json();
//         const isFav = data.some((fav: any) => fav.event.id === eventId);
//         setIsFavorite(isFav);
//       } catch (error) {
//         console.error("Error checking favorites:", error);
//       }
//     };

//     if (eventId) {
//       fetchFavorites();
//     }
//   }, [eventId]);

//   const toggleFavorite = async () => {
//     const token = localStorage.getItem("access_token");
//     if (!token) return alert("Login required");

//     const url = `/api/event/${eventId}/${
//       isFavorite ? "remove-from-favorite" : "add-to-favorite"
//     }/`;
//     const method = isFavorite ? "DELETE" : "POST";

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         setIsFavorite(!isFavorite);
//       } else {
//         const msg = await response.json();
//         alert("Error: " + JSON.stringify(msg));
//       }
//     } catch (err) {
//       console.error("Favorite toggle failed:", err);
//     }
//   };

//   if (!event) return <p>Loading...</p>;

//   const handlePrev = () => {
//     if (startIndex > 0) {
//       setStartIndex(startIndex - 1);
//     }
//   };

//   const handleNext = () => {
//     if (startIndex < recommendedEvents.length - 3) {
//       setStartIndex(startIndex + 1);
//     }
//   };

//   const cardWidth = 315;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import EventDate from "../assets/aboutevent/date.png";
import Location from "../assets/aboutevent/location.png";
import Time from "../assets/aboutevent/time.png";
import TengeSymbol from "../assets/aboutevent/tenge-symbol.png";
import AddToFavorites from "../assets/aboutevent/add_to_favorites.png";
import InFavorites from "../assets/aboutevent/in_favorites.png";
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
  author: any;
}

const AboutEvent = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const { eventId } = useParams<{ eventId: string }>();
  const [userId, setUserId] = useState<number | null>(null);
  const [event, setEvent] = useState<EventType | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const getImageUrl = (imagePath: string) => {
    return imagePath.startsWith("http") ? imagePath : `${BASE_URL}${imagePath}`;
  };
  const BASE_URL = "http://127.0.0.1:8000";
  const navigate = useNavigate();
  const [recommendedEvents, setRecommendedEvents] = useState<EventType[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const isAuthenticated = Boolean(localStorage.getItem("access_token"));

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`/api/event/${eventId}/participants/`);
        const data = await response.json();
        setParticipants(data);
        const currentUserId = getUserIdFromToken();
        const subscribed = data.some((p: any) => p.user.id === currentUserId);
        setIsSubscribed(subscribed);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    if (eventId) {
      fetchParticipants();
    }
  }, [eventId]);

  const subscribeToEvent = async () => {
    try {
      const response = await fetch(`/api/event/${eventId}/subscribe/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.ok) {
        setIsSubscribed(true);
        const updated = await response.json();
        console.log(updated.message);
        const res = await fetch(`/api/event/${eventId}/participants/`);
        setParticipants(await res.json());
      }
    } catch (error) {
      console.error("Error subscribing to event:", error);
    }
  };

  const unsubscribeFromEvent = async () => {
    try {
      const response = await fetch(`/api/event/${eventId}/unsubscribe/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.ok) {
        setIsSubscribed(false);
        const res = await fetch(`/api/event/${eventId}/participants/`);
        setParticipants(await res.json());
      }
    } catch (error) {
      console.error("Error unsubscribing from event:", error);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/event/${eventId}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const responseText = await response.text();

      if (response.status === 204) {
        alert("Event deleted successfully.");
        navigate("/events");
      } else {
        console.error("Delete failed", response.status, responseText);
        alert(`Error ${response.status}: ${responseText}`);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An unexpected error occurred.");
    }
  };

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
    console.log("User ID:", id);
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/event/${eventId}/`);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const fetchRecommendedEvents = async () => {
      try {
        const response = await fetch(`/api/event/${eventId}/other/`);
        const data = await response.json();
        setRecommendedEvents(data);
      } catch (error) {
        console.error("Error fetching recommended events:", error);
      }
    };

    fetchRecommendedEvents();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/events/favorites");
        const data = await response.json();
        const isFav = data.some((fav: any) => fav.event.id === eventId);
        setIsFavorite(isFav);
      } catch (error) {
        console.error("Error checking favorites:", error);
      }
    };

    if (eventId) {
      fetchFavorites();
    }
  }, [eventId]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return alert("Login required");

    const url = `/api/event/${eventId}/${
      isFavorite ? "remove-from-favorite" : "add-to-favorite"
    }/`;
    const method = isFavorite ? "DELETE" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      } else {
        const msg = await response.json();
        alert("Error: " + JSON.stringify(msg));
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    }
  };

  if (!event) return <p>Loading...</p>;

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleNext = () => {
    if (startIndex < recommendedEvents.length - 3) {
      setStartIndex(startIndex + 1);
    }
  };

  const cardWidth = 315;

  return (
    <div className="about-event-content">
      <div className="about-event-main">
        <div className="about-event-header">
          <div
            className="about-event-header-background"
            style={{
              backgroundImage: `url(${
                event.photos?.[0]?.image
                  ? getImageUrl(event.photos[0].image)
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
        <p style={{ fontSize: "20px", textIndent: "2em" }}>
          {event.description}
        </p>
        {event.photos && event.photos.length > 0 && (
          <div className="about-event-gallery">
            <div className="main-photo-wrapper">
              <img
                src={getImageUrl(event.photos[selectedPhotoIndex].image)}
                alt="Main Event"
                className="main-event-photo"
              />
              <div className="thumbnail-overlay">
                {event.photos.map((photo, index) => (
                  <img
                    key={photo.id}
                    src={getImageUrl(photo.image)}
                    alt={`Thumbnail ${index}`}
                    className={`thumbnail-photo ${
                      index === selectedPhotoIndex ? "selected" : ""
                    }`}
                    onClick={() => setSelectedPhotoIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {isAuthenticated && (
          <div>
            <h1 style={{ fontSize: "32px", margin: "0 0 30px" }}>
              Other Events:
            </h1>
            <div className="about-events-slider-controls">
              <button onClick={handlePrev} className="arrow-button">
                ‹
              </button>
              <div className="about-events-slider-window">
                <div
                  className="about-events-slider-track"
                  style={{
                    transform: `translateX(-${startIndex * cardWidth}px)`,
                  }}
                >
                  {recommendedEvents.map((item, index) => (
                    <div key={item.id} className="about-events-carousel-card">
                      <img
                        src={
                          item.photos && item.photos[0]
                            ? getImageUrl(item.photos[0].image)
                            : "/default-event.jpg"
                        }
                        alt="Event"
                        className="about-events-carousel-image"
                      />

                      <div className="about-carousel-column">
                        <h3 className="about-carousel-title">{item.title}</h3>
                        <div className="about-carousel-column-flex">
                          <img src={EventDate} alt="Date" />
                          <p>
                            {new Date(item.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                            })}
                          </p>
                        </div>
                        <div className="about-carousel-column-flex">
                          <img src={Location} alt="Location" />
                          <p>
                            {item.city}, {item.address}
                          </p>
                        </div>
                        <div className="about-carousel-column-flex">
                          <img src={Time} alt="Time" />
                          <p>
                            {new Date(item.date).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="about-carousel-column-flex">
                          <img src={TengeSymbol} alt="Price" />
                          <p>
                            {item.price &&
                            item.price !== "0" &&
                            item.price !== 0
                              ? `${item.price} ₸`
                              : "Free"}
                          </p>
                        </div>
                      </div>
                      <div className="about-carousel-register-row">
                        <p
                          style={{
                            textAlign: "left",
                            lineHeight: "1.2rem",
                            margin: "0",
                            fontSize: "16px",
                          }}
                        >
                          Organized by <br />
                          <Link
                            to={`/friend/${item.author.id}`}
                            style={{ color: "#724A95", textDecoration: "none" }}
                          >
                            @{item.author.username}
                          </Link>
                        </p>
                        <Link
                          to={`/events/${item.id}`}
                          className="about-carousel-button"
                        >
                          Join Event
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleNext} className="arrow-button">
                ›
              </button>
            </div>
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
            <div
              className="sidebar-flex"
              onClick={toggleFavorite}
              style={{ cursor: "pointer" }}
            >
              <img
                src={isFavorite ? InFavorites : AddToFavorites}
                alt="Favorites"
                style={{ width: "30px", height: "30px", margin: "0 6px 0 0" }}
              />
              <p>{isFavorite ? "In Favorites" : "Add to Favorites"}</p>
            </div>
          </div>
          {isAuthenticated && (
            <div className="about-event-sidebar-buttons">
              {userId === event.author.id ? (
                <button
                  className="about-event-button delete"
                  onClick={handleDelete}
                >
                  Delete Event
                </button>
              ) : (
                <button
                  className="about-event-button registration-event"
                  onClick={
                    isSubscribed ? unsubscribeFromEvent : subscribeToEvent
                  }
                >
                  {isSubscribed ? "Leave Event" : "Join Event"}
                </button>
              )}
            </div>
          )}
        </div>
        <div className="about-event-sidebar">
          <div className="about-event-info-box">
            <div className="sidebar-title-date">
              <p style={{ fontSize: "24px" }}>
                Participants{" "}
                <span style={{ color: "#8C8C8C" }}>{participants.length}</span>
              </p>
            </div>
            <div className="sidebar-participants">
              {participants.length === 0 ? (
                <p>No participants yet.</p>
              ) : (
                participants.map((userWrapper) => {
                  const user = userWrapper.user;
                  return (
                    <div key={user.id} className="participant-row">
                      <img
                        src={
                          user.profile_image
                            ? getImageUrl(user.profile_image)
                            : "/default-avatar.png"
                        }
                        alt={user.username}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <Link
                        to={`/friend/${user.id}`}
                        style={{
                          textDecoration: "none",
                          color: "#333",
                          fontSize: "14px",
                        }}
                      >
                        @{user.username}
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutEvent;
