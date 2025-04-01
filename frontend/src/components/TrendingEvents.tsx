import React from "react";
import "../styles/TrendingEvents.css";

const events = [
  {
    id: 1,
    image: "/",
    date: "21 Feb",
    title: "Выставка «Густав Климт и Рене Магритт. Ожившие полотна»",
    time: "11:00-20:00, Lumiere Hall",
    link: "/event/1",
    large: true,
  },
  {
    id: 2,
    image: "../assets/cinema.jpg",
    date: "21 Feb",
    title: "Выставка «Густав Климт и Рене Магритт. Ожившие полотна»",
    time: "11:00-20:00, Lumiere Hall",
    link: "/event/2",
  },
  {
    id: 3,
    image: "image3.jpg",
    date: "21 Feb",
    title: "Выставка «Густав Климт и Рене Магритт. Ожившие полотна»",
    time: "11:00-20:00, Lumiere Hall",
    link: "/event/3",
  },
  {
    id: 4,
    image: "image4.jpg",
    date: "21 Feb",
    title: "Выставка «Густав Климт и Рене Магритт. Ожившие полотна»",
    time: "11:00-20:00, Lumiere Hall",
    link: "/event/4",
  },
];

const TrendingEvents: React.FC = () => {
  return (
    <div className="trending">
      <h2>Trending Now</h2>
      <p>The most exciting events happening right now—don't miss out!</p>

      <div className="grid-container">
        {events.map((event) => (
          <a
            key={event.id}
            href={event.link}
            className={`grid-item ${event.large ? "large" : ""}`}
          >
            <img src={event.image} alt={event.title} />
            <div className="event-info">
              <span className="date">{event.date}</span>
              <p>{event.title}</p>
              <span>{event.time}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TrendingEvents;
