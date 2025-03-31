import { useEffect } from "react";
import "../styles/HeroContactUs.css";
import Email from "../assets/email.png";
import Whatsapp from "../assets/whatsapp.png";
import Instagram from "../assets/instagram.png";
import TikTok from "../assets/tiktok.png";
import Boy from "../assets/boy.png";
import QuestionMark from "../assets/questionmark.png";
import FAQ from "../components/FAQ";

const HeroContactUs = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <section>
      <div className="stayconnected">
        <h1>
          Contact Us — <br />
          Let's Stay Connected
        </h1>
        <p>
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
              youremail@mail.com
            </li>
            <li>
              <a href="/">
                <img src={Whatsapp} alt="Whatsapp" />
              </a>{" "}
              +7 (***) *** ****
            </li>
            <li>
              <a href="/">
                <img src={Instagram} alt="Instagram" />
              </a>{" "}
              barib1r.app
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
          <h2>Get In Touch With Us</h2>
          <p>AND WE WILL GET BACK TO YOU.</p>
          <hr />
          <form>
            <div className="input-row">
              <input type="text" placeholder="First Name" />
              <input type="text" placeholder="Last Name" />
            </div>
            <input type="email" placeholder="Email" />
            <input type="text" placeholder="Subject" />
            <textarea typeof="text" placeholder="Message"></textarea>
            <button type="submit">SUBMIT</button>
          </form>
        </div>
      </div>
      <div className="faq-content">
        <div className="faq-images">
          <img src={Boy} alt="Boy" className="boy-img" />
          <h1>Before You Contact Us, Check Our FAQ</h1>
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
export default HeroContactUs;
