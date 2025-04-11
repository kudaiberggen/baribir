import { Link } from "react-router-dom";
import "../styles/Footer.css";
import WhiteLogo from "../assets/BariB1r-white.png";
import AppStore from "../assets/appstore.png";
import GooglePLay from "../assets/googleplay.png";
import Instagram from "../assets/instagram.png";
import Telegram from "../assets/telegram.png";
import Whatsapp from "../assets/whatsapp.png";
import Tiktok from "../assets/tiktok.png";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-left">
          <img
            src={WhiteLogo}
            alt="Company Logo"
            style={{ width: "160px", margin: "50px auto 10px" }}
          />
          <p style={{ fontSize: "16px", fontWeight: "400", opacity: "0.85" }}>
            Find events, meet like-minded people,<br></br> and turn moments into
            memories.
          </p>
          <div className="socialmedia-div">
            <a href="/">
              <img src={Instagram} alt="Instagram" />
            </a>
            <a href="/">
              <img src={Telegram} alt="Telegram" />
            </a>
            <a href="/">
              <img src={Whatsapp} alt="Whatsapp" />
            </a>
            <a href="/">
              <img src={Tiktok} alt="Tiktok" />
            </a>
          </div>
          <div className="app-buttons">
            <a href="https://www.apple.com/app-store/">
              <img src={AppStore} alt="Download on the App Store" />
            </a>
            <a href="https://play.google.com/store/games?hl=ru">
              <img src={GooglePLay} alt="Get it on Google Play" />
            </a>
          </div>
          <p
            style={{
              margin: "10px auto 30px",
              lineHeight: "16px",
              fontSize: "12px",
              opacity: "0.8",
            }}
          >
            Copyright © 2025 BariB1r. All rights reserved.<br></br>Bringing
            people together through experiences.
          </p>
        </div>
        <div className="footer-right">
          <div className="footer-column-div">
            <div className="footer-column">
              <h3 style={{ fontSize: "24px", marginBottom: "12px" }}>
                Overview
              </h3>
              <Link to="/">Home</Link>
              <Link to="/events">Events</Link>
              <Link to="/about">About us</Link>
              <Link to="/contact">Contact us</Link>
            </div>
            <div className="footer-column">
              <h3 style={{ fontSize: "24px", marginBottom: "12px" }}>
                Contacts
              </h3>
              <Link to="/contact#faq">FAQ</Link>
              <p>+7 (***) *** ****</p>
              <p>baribir@gmail.com</p>
            </div>
          </div>
          <p>
            Subscribe to our newsletter for the latest events, exclusive
            <br></br>
            meetups, and special offers.
          </p>
          <div className="newsletter">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
