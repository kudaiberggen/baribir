import { useState } from "react";

import SearchIcon from "../assets/home/search.svg";
import B1 from "../assets/events/B1.png";
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

const Events = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = () => {
    console.log("Search triggered for:", searchQuery);
  };

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
          </div>
          <div className="search-events-input-wrapper">
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
      </div>
    </section>
  );
};
export default Events;
