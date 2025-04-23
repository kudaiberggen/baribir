import { useState, useEffect } from "react";
import "../styles/Contact.css";
import Email from "../assets/contact/email.png";
import Whatsapp from "../assets/footer/whatsapp.png";
import Instagram from "../assets/footer/instagram.png";
import TikTok from "../assets/footer/tiktok.png";
import Boy from "../assets/contact/boy.png";
import QuestionMark from "../assets/contact/questionmark.png";
import FAQ from "../components/FAQ";

const Contact = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(
        "https://formsubmit.co/276a98dab0d060094e4b0350b7a26de4",
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        setSent(true);
        form.reset();
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("There was a problem submitting the form.");
    }
  };

  return (
    <section>
      <div className="stayconnected">
        <h1 style={{ fontSize: "50px" }}>
          Contact Us — <br />
          Let's Stay Connected
        </h1>
        <p style={{ fontSize: "24px", fontWeight: "400", opacity: "0.85" }}>
          Have questions, feedback,
          <br /> or partnership ideas?
          <br /> Reach out to us, and we'll be happy <br />
          to help!
        </p>
      </div>
      <div className="contact-container">
        <div className="contact-info">
          <h2>Contact us</h2>
          <ul>
            <li>
              <a href="/">
                <img src={Email} alt="Email" />
              </a>{" "}
              baribir.events@gmail.com
            </li>
            <li>
              <a href="/">
                <img src={Whatsapp} alt="Whatsapp" />
              </a>{" "}
              +7 (775) 726 2132
            </li>
            <li>
              <a href="/">
                <img src={Instagram} alt="Instagram" />
              </a>{" "}
              barib1r.events
            </li>
            <li>
              <a href="/">
                <img src={TikTok} alt="TikTok" />
              </a>{" "}
              barib1r
            </li>
          </ul>
        </div>

        <div className="contact-form">
          <h2 style={{ fontSize: "36px", fontWeight: "bold", margin: "0" }}>
            Get In Touch With Us
          </h2>
          <p style={{ color: "#8978c7", fontSize: "24px" }}>
            AND WE WILL GET BACK TO YOU.
          </p>
          <hr />
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="_captcha" value="false" />
            <input
              type="text"
              name="fullname"
              placeholder="Full name"
              required
            />
            <input type="email" name="email" placeholder="Email" required />
            <textarea name="message" placeholder="Message"></textarea>
            <button type="submit" disabled={sent}>
              {sent ? "SENT" : "SUBMIT"}
            </button>
          </form>
        </div>
      </div>
      <div className="faq-content">
        <div className="faq-images">
          <img src={Boy} alt="Boy" className="boy-img" />
          <h1>
            Before You Contact Us, Check Our{" "}
            <span style={{ color: "#411666" }}>FAQ</span>
          </h1>
          <img
            src={QuestionMark}
            alt="Question Mark"
            className="question-img"
          />
        </div>
        <div className="faq-undercontent" id="faq">
          <p>FAQ</p>
          <h2>Frequently Asked Questions</h2>
        </div>
        <FAQ />
      </div>
    </section>
  );
};
export default Contact;
