import React, { useEffect, useRef } from "react";
import "../styles/Testimonials.css";
import scroll1 from "../assets/scroll1.jpg";
import scroll2 from "../assets/scroll2.jpg";
import scroll3 from "../assets/scroll3.jpg";
import scroll4 from "../assets/scroll4.jpg";
import scroll5 from "../assets/scroll5.jpg";
import scroll6 from "../assets/scroll6.jpg";

const testimonials = [
  {
    id: 1,
    name: "Anna Mitchell",
    role: "Manager",
    text: "Bar1b1r turned my weekends into real adventures! I’ve met so many great people.",
    image: scroll1,
    rating: 5,
  },
  {
    id: 2,
    name: "John Doe",
    role: "Designer",
    text: "Great experience! This platform connects amazing people with unique events.",
    image: scroll2,
    rating: 4,
  },
  {
    id: 3,
    name: "Emily Carter",
    role: "Photographer",
    text: "I love the variety of events and the ease of meeting new friends!",
    image: scroll3,
    rating: 5,
  },
  {
    id: 4,
    name: "Michael Smith",
    role: "Entrepreneur",
    text: "The community aspect is amazing! I’ve never felt so welcomed!",
    image: scroll4,
    rating: 5,
  },
  {
    id: 5,
    name: "Sophia Lee",
    role: "Writer",
    text: "A perfect place to connect with like-minded people and make memories!",
    image: scroll5,
    rating: 5,
  },
  {
    id: 6,
    name: "David Brown",
    role: "Musician",
    text: "Amazing platform with a lot of opportunities to explore!",
    image: scroll6,
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrame: number;
    let start: number | null = null;
    const speed = 0.5; // Скорость прокрутки

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      scrollContainer.scrollLeft += speed;
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      }
      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="testimonials">
      <h2>What People Think About Us</h2>
      <div className="scroll-container" ref={scrollRef}>
        <div className="scroll-content">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="avatar"
              />
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="divider"></div>
              <div className="testimonial-footer">
                <div>
                  <strong>{testimonial.name}</strong>
                  <span className="role">{testimonial.role}</span>
                </div>
                <div className="stars">{"★".repeat(testimonial.rating)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
