import { Link } from "react-router-dom";
import "../styles/Home.css";
import Concert from "../assets/home/concert.png";
import Magnifier from "../assets/home/magnifier.svg";
import Handshake from "../assets/home/handshake.svg";
import Ticket from "../assets/home/ticket.svg";
import Search from "../assets/home/search.svg";
import Calendar from "../assets/home/calendar.svg";
import Book from "../assets/home/book.svg";
import TrendingEvents from "../components/TrendingEvents";
import Testimonials from "../components/Testimonials";

const Home = () => {
  return (
    <section>
      <div className="getstarted">
        <div className="content">
          <h1>
            Find <span style={{ color: "#411666" }}>Events</span>, Meet{" "}
            <span style={{ color: "#411666" }}>People</span>
            <br />
            and Make <span style={{ color: "#411666" }}>Memories</span>
          </h1>
          <p>
            Bring people together, create shared experiences, and keep the
            <br />
            memories alive—your next adventure starts here.
          </p>
          <Link to="/events">Get Started</Link>
        </div>
        <img src={Concert} alt="Concert" className="background-image" />
      </div>
      <div className="how-it-works">
        <h2>How It Works?</h2>
        <div className="steps-container">
          <div className="step">
            <div className="icon-container">
              <img src={Magnifier} alt="Find Events" />
            </div>
            <h3>Find Events</h3>
            <p>
              Discover meetups, parties, workshops, and more based on your
              interests.
              <br />
              <span
                style={{
                  marginLeft: "20px",
                  display: "block",
                  marginTop: "10px",
                }}
              >
                Whether it's a spontaneous gathering or a planned event, there's
                always something exciting happening.
              </span>
            </p>
          </div>

          <div className="step">
            <div className="icon-container">
              <img src={Handshake} alt="Meet People" />
            </div>
            <h3>Meet People</h3>
            <p>
              Connect with like-minded people, chat before the event, and build
              new friendships.<br></br>
              <span
                style={{
                  marginLeft: "20px",
                  display: "block",
                  marginTop: "10px",
                }}
              >
                Bar1bir helps turn shared experiences into lasting connections.
              </span>
            </p>
          </div>

          <div className="step">
            <div className="icon-container">
              <img src={Ticket} alt="Join & Enjoy" />
            </div>
            <h3>Join & Enjoy</h3>
            <p>
              RSVP with one tap, stay updated, and have fun.<br></br>
              <span
                style={{
                  marginLeft: "20px",
                  display: "block",
                  marginTop: "10px",
                }}
              >
                After the event, save your favorite moments in My Memories and
                keep in touch with new friends.
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="features-container">
          <div className="features-text">
            <h3 className="features-subtitle">What We Give —</h3>
            <h2 className="features-title">
              Best Features <br /> For You
            </h2>
            <p className="features-description">
              Bar1bir simplifies discovering events, connecting with like-minded
              people, and creating unforgettable memories—all in one seamless
              platform.
            </p>
          </div>

          <div className="features-cards">
            <div className="feature-card">
              <div className="icon">
                <img src={Search} alt="Custom Event Suggestions" />
              </div>

              <h3>Custom Event Suggestions</h3>
              <p>
                Receive personalized event recommendations based on your
                interests, location, and past activities, ensuring you never
                miss out on exciting opportunities.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon">
                <img src={Calendar} alt="Easy Event Creation" />
              </div>
              <h3>Easy Event Creation</h3>
              <p>
                Whether it's a small gathering or a large meetup, organizing
                events takes just a few clicks—invite people, set details, and
                bring your ideas to life.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon">
                <img src={Book} alt="My Memories" />
              </div>
              <h3>My Memories</h3>
              <p>
                Save your favorite events, revisit past experiences, and keep
                track of the moments that matter most.
              </p>
            </div>
          </div>
        </div>
      </div>
      <TrendingEvents />
      <Testimonials />
    </section>
  );
};
export default Home;
