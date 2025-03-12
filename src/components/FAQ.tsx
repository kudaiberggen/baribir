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
      "Use filters such as category, location, and date to discover events that suit your preferences.",
  },
  {
    question: "Can I message other users before an event?",
    answer:
      "Yes! You can chat with event attendees, add friends, and stay connected with people you meet through Barib1r.",
  },
  {
    question: "Can I save events I've attended?",
    answer:
      "Absolutely! You can save past events in the 'My Memories' section to revisit them anytime.",
  },
  {
    question: "How do I stay updated on upcoming events?",
    answer:
      "Subscribe to our newsletter or enable notifications to get updates on new and trending events near you.",
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
