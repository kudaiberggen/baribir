import { useState } from "react";
import "../styles/FAQ.css";

const faqData = [
  {
    question: "What is Barib1r?",
    answer:
      "Barib1r is a platform that helps you find, create, and join events based on your interests. Connect with like-minded people, explore new experiences, and build real-life connections.",
  },
  {
    question: "How can I create my own event?",
    answer:
      "You can create your own event by clicking the 'Create Event' button located in the header and on the 'My Events' page.",
  },
  {
    question: "What happens after I register for an event?",
    answer:
      "After registering for an event, it will automatically appear on your 'Upcoming Events' page. You can also cancel your registration there if you can't attend.",
  },
  {
    question: "How do notifications work on Bar1b1r?",
    answer:
      "Notifications keep you informed about important updates—like changes to events you've joined, friend requests, and reminders before an event starts.",
  },
  {
    question: "Can I add friends on Bar1b1r?",
    answer:
      "Yes! You can follow other users by clicking the Follow button on their profile. Their profile shows events they've attended, their favorites, and events they've created—so you can stay connected and explore what they're into.",
  },
  {
    question: "How do I report an issue with an event or user?",
    answer:
      "If you encounter any issues, you can report an event or a user through the app, or contact our support team at support@barib1r.com",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq">
      {faqData.map((item, index) => (
        <div
          key={index}
          className={`faq-item ${activeIndex === index ? "active" : ""}`}
        >
          <button className="faq-question" onClick={() => toggleFAQ(index)}>
            {item.question}
            <span className="faq-icon">
              {activeIndex === index ? "⮝" : "⮟"}
            </span>
          </button>
          <div
            className="faq-answer"
            style={{ maxHeight: activeIndex === index ? "100px" : "0" }}
          >
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
