import React, { useEffect, useRef } from "react";
import "../styles/Testimonials.css";
import review1 from "../assets/home/review1.jpg";
import review2 from "../assets/home/review2.jpg";
import review3 from "../assets/home/review3.jpg";
import review4 from "../assets/home/review4.jpg";
import review5 from "../assets/home/review5.jpg";
import review6 from "../assets/home/review6.jpg";

const testimonials = [
  {
    id: 1,
    name: "Rakhimov Asanali",
    role: "Financier",
    text: "Bar1b1r turned my weekends into real adventures! I've met so many great people.",
    image: review1,
    rating: 5,
  },
  {
    id: 2,
    name: "Melisov Airkhan",
    role: "Metallurgist",
    text: "Great experience! This platform connects amazing people with unique events.",
    image: review2,
    rating: 4,
  },
  {
    id: 3,
    name: "Kusainova Ulzhan",
    role: "Businesswoman",
    text: "I love the variety of events and the ease of meeting new friends! Keep up the good work guys!",
    image: review3,
    rating: 5,
  },
  {
    id: 4,
    name: "Raisov Maksat",
    role: "Dentist",
    text: "The community aspect is amazing! Looking forward to new events with new people.",
    image: review4,
    rating: 5,
  },
  {
    id: 5,
    name: "Orynbasarov Dastan",
    role: "Student",
    text: "A perfect place to connect with like-minded people and make memories!",
    image: review5,
    rating: 5,
  },
  {
    id: 6,
    name: "Nurlanova Saya",
    role: "Psychologist",
    text: "Amazing platform with a lot of opportunities to explore! I hope you will make an app in the future.",
    image: review6,
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
    const speed = 0.5;

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
