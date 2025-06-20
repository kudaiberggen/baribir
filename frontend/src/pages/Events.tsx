import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import B1 from "../assets/events/B1.png";
import ArrowDown from "../assets/events/arrow-down.svg";
import ArrowUp from "../assets/events/arrow-up.svg";
import "../styles/Events.css";

import Entertainment from "../assets/events/entertainment.png";
import Culture from "../assets/events/culture&arts.png";
import Tech from "../assets/events/tech&it.png";
import Food from "../assets/events/food&drinks.png";

interface EventPhoto {
  id: number;
  image: string;
}

type EventType = {
  id: string;
  title: string;
  description: string;
  photos?: EventPhoto[];
  category?: string | number | null;
  city: string;
  address: string;
  date: string;
  price?: string | number | null;
};

const fetchWithOptionalAuth = (url: string) => {
  const token = localStorage.getItem("access_token");

  return fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

const Events = () => {
  const [carouselEvents, setCarouselEvents] = useState<EventType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [selectedCity, setSelectedCity] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [showMoreEvents, setShowMoreEvents] = useState(false);
  const [categories, setCategories] = useState<
    { code: string; name: string }[]
  >([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [popularEvents, setPopularEvents] = useState<EventType[]>([]);
  const findCategoryByName = (name: string) =>
    categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase());

  const cardWidth = 320;

  useEffect(() => {
    fetch("/api/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Ошибка загрузки категорий:", err));

    fetch("/api/cities/")
      .then((res) => res.json())
      .then(setCities)
      .catch((err) => console.error("Ошибка загрузки городов:", err));

    fetchWithOptionalAuth("/api/events/")
      .then((res) => res.json())
      .then(setCarouselEvents)
      .catch((err) => console.error("Ошибка загрузки карусели событий:", err));
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (selectedDate)
      queryParams.append("date", selectedDate.toISOString().split("T")[0]);
    if (selectedCategory)
      queryParams.append("category", selectedCategory.code.toString());
    if (selectedCity) queryParams.append("city", selectedCity.id.toString());

    fetchWithOptionalAuth(`/api/events/?${queryParams}`)
      .then((res) => res.json())
      .then(setEvents)
      .catch((err) => console.error("Ошибка загрузки событий:", err));
  }, [selectedDate, selectedCategory, selectedCity]);

  useEffect(() => {
    fetchWithOptionalAuth("/api/events/popular/")
      .then((res) => res.json())
      .then(setPopularEvents)
      .catch((err) =>
        console.error("Ошибка загрузки популярных событий:", err)
      );
  }, []);

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString("en-EN", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatPrice = (price: number | null | string | undefined) =>
    !price || Number(price) <= 0 ? "Free" : `${price}₸`;

  const renderDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 20; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      const isActive = day.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={i}
          className={`calendar-day ${isActive ? "active" : ""}`}
          onClick={() => setSelectedDate(day)}
        >
          <div>{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
          <div>{day.getDate()}</div>
        </div>
      );
    }

    return days;
  };

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const handleNext = () => {
    if (startIndex < carouselEvents.length - 3) setStartIndex(startIndex + 1);
  };

  return (
    <section>
      <div className="events-slider-controls">
        <button onClick={handlePrev} className="arrow-button">
          ‹
        </button>
        <div className="events-slider-window">
          <div
            className="events-slider-track"
            style={{
              transform: `translateX(-${startIndex * cardWidth}px)`,
            }}
          >
            {carouselEvents.map((event, index) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="events-carousel-card"
              >
                <img
                  src={
                    event.photos?.[0]?.image
                      ? `http://127.0.0.1:8000${event.photos[0].image}`
                      : "/default-event.jpg"
                  }
                  alt="Event"
                  className="events-carousel-image"
                />
              </Link>
            ))}
          </div>
        </div>
        <button onClick={handleNext} className="arrow-button">
          ›
        </button>
      </div>
      <div className="top-categories">
        <h2 style={{ fontSize: "40px" }}>Top Categories</h2>

        <div className="top-categories-flex">
          {[
            ["Entertainment", Entertainment],
            ["Culture & Arts", Culture],
            ["Tech & IT", Tech],
            ["Food & Drinks", Food],
          ].map(([name, img]) => (
            <div
              className="top-categories-card"
              key={name}
              onClick={() => {
                const category = findCategoryByName(name);
                if (category) setSelectedCategory(category);
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="top-categories-image">
                <img src={img as string} alt={name} />
              </div>
              <p>{name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="events-main">
        <div className="search-events">
          <div className="b1-elements">
            <img src={B1} alt="B1 Events" />
            <div
              className="custom-dropdown"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <div className="dropdown-header">
                {selectedCategory?.name || "Categories"}
                <span className="arrow">
                  <img src={isCategoryOpen ? ArrowUp : ArrowDown} alt="Arrow" />
                </span>
              </div>
              {isCategoryOpen && (
                <ul className="dropdown-list">
                  {categories.map((category) => (
                    <li
                      key={category.code}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsCategoryOpen(false);
                      }}
                    >
                      {category.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div
              className="custom-dropdown"
              onClick={() => setIsCityOpen(!isCityOpen)}
            >
              <div className="dropdown-header">
                {selectedCity?.name || "City"}
                <span className="arrow">
                  <img src={isCityOpen ? ArrowUp : ArrowDown} alt="Arrow" />
                </span>
              </div>
              {isCityOpen && (
                <ul className="dropdown-list">
                  {cities.map((city) => (
                    <li
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsCityOpen(false);
                      }}
                    >
                      {city.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="calendar-container">
          <h2
            style={{
              fontSize: "20px",
              marginBottom: "10px",
              fontWeight: "500",
            }}
          >
            {selectedDate.toLocaleDateString("en-US", { month: "long" })}
          </h2>
          <div className="calendar-week">{renderDays()}</div>
        </div>

        <div className="events-tab-pane">
          {events.length === 0 ? (
            <p
              style={{ color: "#888", marginTop: "20px", textAlign: "center" }}
            >
              There are no events on this day.
            </p>
          ) : (
            <>
              <div className="event-cards">
                {(showMoreEvents ? events : events.slice(0, 12)).map(
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
                              padding: "5px 20px",
                              borderRadius: "8px",
                              fontSize: "14px",
                              zIndex: 2,
                            }}
                          >
                            {event.category || "General"}
                          </div>
                        </div>
                        <h3 style={{ color: "#202020", margin: "10px 0" }}>
                          {event.title}
                        </h3>
                        <p style={{ color: "#ABABAB", margin: "4px 0" }}>
                          {event.city}, {event.address}
                        </p>
                        <p style={{ color: "#ABABAB", margin: "4px 0" }}>
                          {formatDateTime(event.date)}
                        </p>
                        <p style={{ color: "#ABABAB", margin: "4px 0" }}>
                          {formatPrice(event.price)}
                        </p>
                      </div>
                    </Link>
                  )
                )}
              </div>

              {events.length > 12 && (
                <button
                  onClick={() => setShowMoreEvents(!showMoreEvents)}
                  className="show-more-button"
                >
                  {showMoreEvents ? "Show less" : "Show more"}
                </button>
              )}
            </>
          )}
        </div>

        {popularEvents.length > 0 && (
          <div className="popular-now-section">
            <h2
              style={{
                fontSize: "36px",
                fontWeight: "700",
                marginBottom: "20px",
              }}
            >
              Popular Now!
            </h2>
            <div className="popular-grid">
              <div className="popular-main-card">
                <Link
                  to={`/events/${popularEvents[0].id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={
                        popularEvents[0].photos?.[0]?.image
                          ? `http://127.0.0.1:8000${popularEvents[0].photos[0].image}`
                          : "/default-event.jpg"
                      }
                      alt="{popularEvents[0].title}"
                      className="popular-main-image"
                    />
                    <div className="popular-main-category">
                      {" "}
                      {popularEvents[0].category || "General"}
                    </div>
                  </div>
                  <div className="popular-main-content">
                    <h3 style={{ fontSize: "24px" }}>
                      {popularEvents[0].title}
                    </h3>
                    <p>{popularEvents[0].description}</p>
                  </div>
                </Link>
              </div>
              <div className="popular-side-cards">
                {popularEvents.slice(1, 4).map((event) => (
                  <Link
                    to={`/events/${event.id}`}
                    key={event.id}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="popular-side-card">
                      <div style={{ position: "relative" }}>
                        <img
                          src={
                            event.photos?.[0]?.image
                              ? `http://127.0.0.1:8000${event.photos[0].image}`
                              : "/default-event.jpg"
                          }
                          alt={event.title}
                        />
                        <div className="popular-category">
                          {event.category || "General"}
                        </div>
                      </div>
                      <div>
                        <h4>{event.title}</h4>
                        <p>{event.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default Events;
