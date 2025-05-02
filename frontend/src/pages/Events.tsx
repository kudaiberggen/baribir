import { useState, useEffect } from "react";

import B1 from "../assets/events/B1.png";
import ArrowDown from "../assets/events/arrow-down.svg";
import ArrowUp from "../assets/events/arrow-up.svg";
import "../styles/Events.css";

import Entertainment from "../assets/events/entertainment.png";
import Culture from "../assets/events/culture&arts.png";
import Tech from "../assets/events/tech&it.png";
import Food from "../assets/events/food&drinks.png";
import event from "../assets/events/event.png";

const eventcarousel = [
  {
    image: event,
  },
  {
    image: event,
  },
  {
    image: event,
  },
  {
    image: event,
  },
  {
    image: event,
  },
];

const allEvents = [
  {
    image: event,
    title: "Киноужин Гарри Поттером",
    date: "2025-05-02",
  },
  {
    image: event,
    title: "Йога в парке",
    date: "2025-05-04",
  },
  {
    image: event,
    title: "Вечеринка 90",
    date: "2025-05-02",
  },
];

type EventType = {
  image: string;
  title: string;
  date: string;
};

const Events = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);
  const [showMoreEvents, setShowMoreEvents] = useState(false);

  const categories = [
    "Entertainment",
    "Culture & Arts",
    "Tech & IT",
    "Food & Drinks",
  ];
  const cities = ["Almaty", "Astana", "Shymkent"];

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setIsCityOpen(false);
  };

  useEffect(() => {
    setEvents(allEvents);
  }, []);

  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const response = await fetch("/api/event/", {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //         },
  //       });
  //       const data = await response.json();
  //       console.log("My Events Data:", data);
  //       setEvents(data);
  //     } catch (error) {
  //       console.error("Error fetching events:", error);
  //     }
  //   };

  //   fetchEvents();
  // }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const renderDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 20; i++) {
      const day = new Date();
      day.setDate(today.getDate() + i);

      const isActive = day.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={i}
          className={`calendar-day ${isActive ? "active" : ""}`}
          onClick={() => handleDateClick(day)}
        >
          <div>{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
          <div>{day.getDate()}</div>
        </div>
      );
    }

    return days;
  };

  const filteredEvents = events.filter((event) => {
    const matchesDate =
      new Date(event.date).toDateString() === selectedDate.toDateString();
    const matchesCategory =
      selectedCategory === "All" || event.title.includes(selectedCategory);
    const matchesCity =
      selectedCity === "All" || event.title.includes(selectedCity);

    return matchesDate && matchesCategory && matchesCity;
  });

  const handlePrev = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const handleNext = () => {
    if (startIndex < eventcarousel.length - 3) setStartIndex(startIndex + 1);
  };

  const cardWidth = 320;

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
            {eventcarousel.map((user, index) => (
              <div key={index} className="events-carousel-card">
                <img
                  src={user.image}
                  alt="Events"
                  className="events-carousel-image"
                />
              </div>
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
          <div className="top-categories-card">
            <div className="top-categories-image">
              <img src={Entertainment} alt="Entertainment" />
            </div>
            <p>Entertainment</p>
          </div>
          <div className="top-categories-card">
            <div className="top-categories-image">
              <img src={Culture} alt="Culture & Arts" />
            </div>
            <p>Culture & Arts</p>
          </div>
          <div className="top-categories-card">
            <div className="top-categories-image">
              <img src={Tech} alt="Tech & IT" />
            </div>
            <p>Tech & IT</p>
          </div>
          <div className="top-categories-card">
            <div className="top-categories-image">
              <img src={Food} alt="Food & Drinks" />
            </div>
            <p>Food & Drinks</p>
          </div>
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
                {selectedCategory === "All" ? "Categories" : selectedCategory}
                <span className="arrow">
                  <img src={isCategoryOpen ? ArrowUp : ArrowDown} alt="Arrow" />
                </span>
              </div>
              {isCategoryOpen && (
                <ul className="dropdown-list">
                  {categories.map((cat) => (
                    <li key={cat} onClick={() => handleSelectCategory(cat)}>
                      {cat}
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
                {selectedCity === "All" ? "City" : selectedCity}
                <span className="arrow">
                  <img src={isCityOpen ? ArrowUp : ArrowDown} alt="Arrow" />
                </span>
              </div>
              {isCityOpen && (
                <ul className="dropdown-list">
                  {cities.map((city) => (
                    <li key={city} onClick={() => handleSelectCity(city)}>
                      {city}
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
        <div>
          {filteredEvents.map((event, index) => (
            <div key={index} className="events-carousel-card">
              <img
                src={event.image}
                alt={event.title}
                className="events-carousel-image"
              />
              <p style={{ padding: "10px" }}>{event.title}</p>
            </div>
          ))}
        </div>
        {/* <div className="myevents-tab-pane">
          {Events.length === 0 ? (
            <p style={{ color: "#888", marginTop: "20px" }}>
              There are no events on this day.
            </p>
          ) : (
            <>
              <div className="event-cards">
                {(showMoreEvents ? Events : Events.slice(0, 12)).map(
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

              {Events.length > 12 && (
                <button
                  onClick={() => setShowMoreEvents(!showMoreEvents)}
                  className="show-more-button"
                >
                  {showMoreEvents ? "Show less" : "Show more"}
                </button>
              )}
            </>
          )}
        </div> */}
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
              <div style={{ position: "relative" }}>
                <img
                  src={event}
                  alt="Йога на крыше"
                  className="popular-main-image"
                />
                <div className="popular-main-category">Sport</div>
              </div>
              <div className="popular-main-content">
                <h3 style={{ fontSize: "24px" }}>
                  🌅 Рассветная йога на крыше
                </h3>
                <p style={{ fontSize: "16px", color: "#666" }}>
                  Начни день с гармонии! Расслабляющая йога под первым солнечным
                  светом города, свежий воздух и невероятный вид на
                  пробуждающийся мир.
                </p>
              </div>
            </div>
            <div className="popular-side-cards">
              <div className="popular-side-card">
                <div style={{ position: "relative" }}>
                  <img src={event} alt="Импровизационный вечер" />
                  <div className="popular-category">Art</div>
                </div>
                <div>
                  <h4>🎭 Импровизационный вечер: театр без сценария</h4>
                  <p>
                    Никаких репетиций — только мгновенное творчество! Будь
                    частью непредсказуемого спектакля.
                  </p>
                </div>
              </div>

              <div className="popular-side-card">
                <div style={{ position: "relative" }}>
                  <img src={event} alt="Суши мастер-класс" />
                  <div className="popular-category">Food</div>
                </div>
                <div>
                  <h4>🍣 Мастер-класс: готовим суши как в Японии</h4>
                  <p>
                    Освой роллы под руководством шефа и наслаждайся вкусом своих
                    кулинарных шедевров!
                  </p>
                </div>
              </div>

              <div className="popular-side-card">
                <div style={{ position: "relative" }}>
                  <img src={event} alt="Настольные игры" />
                  <div className="popular-category">Games</div>
                </div>
                <div>
                  <h4>🎲 Вечер настольных игр</h4>
                  <p>
                    Мафия, Диксит, Монополия и уютная атмосфера — всё, чтобы
                    хорошо провести вечер.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Events;
