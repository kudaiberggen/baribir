import { Link } from "react-router-dom";
import "../styles/Home.css";
import Concert from "../assets/home/concert.png";
import Magnifier from "../assets/home/magnifier.svg";
import Handshake from "../assets/home/handshake.svg";
import Ticket from "../assets/home/ticket.svg";
import Search from "../assets/home/search.svg";
import Calendar from "../assets/home/calendar.svg";
import Book from "../assets/home/book.svg";
import PurpleYes from "../assets/home/purple-yes.png";
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
      <div className="build-div">
        <div className="build-left"></div>
        <div className="build-right">
          <h1 style={{ fontSize: "50px", margin: "10px 0" }}>
            Build Your Own <br />
            Profile
          </h1>
          <hr
            style={{
              border: "2px solid #411666",
              width: "270px",
              margin: "20px 0 20px",
            }}
          />
          <p>
            It helps you keep track of everything you've experienced and
            <br />
            everything you're excited to attend in the future.
          </p>
          <p>
            <span style={{ color: "#411666", fontWeight: "bold" }}>
              Event's Attended
            </span>{" "}
            - view your personal event history at any time.
          </p>
          <p>
            <span style={{ color: "#411666", fontWeight: "bold" }}>
              Favorites
            </span>{" "}
            - save events you don't want to miss or plan to attend.
          </p>
          <p>
            <span style={{ color: "#411666", fontWeight: "bold" }}>
              Tailored Suggestions
            </span>{" "}
            - get better recommendations based on your interests.
          </p>
          <p>
            Simple, organized, and always with you — your profile helps <br />
            you make the most of every event.
          </p>
        </div>
      </div>
      <div className="simple-div">
        <div className="simple-left">
          <h1 style={{ fontSize: "40px", margin: "10px 0" }}>
            🎯 Find Or Host Events <br />
            In Just A Few Steps <br />
            We've Made It Simple:
          </h1>
          <hr
            style={{
              border: "2px solid #411666",
              width: "300px",
              margin: "20px 0 20px",
            }}
          />
          <p>
            You can explore events by theme, date, or location — or organize{" "}
            <br />
            your own in just a few clicks.
          </p>
          <div style={{ margin: "50px 0 30px" }}>
            <p>
              <img src={PurpleYes} alt="Yes" /> Browse through events that match
              your interests.
            </p>
            <p>
              <img src={PurpleYes} alt="Yes" /> Join events and add them to
              upcoming events.
            </p>
            <p>
              <img src={PurpleYes} alt="Yes" /> Host your own event with
              easy-to-use tools.
            </p>
            <p>
              <img src={PurpleYes} alt="Yes" /> Interact with other attendees
              before and after the event.
            </p>
          </div>
          <p>No complicated steps. Just meaningful moments.</p>
        </div>
        <div className="simple-right"></div>
      </div>
      <Testimonials />
    </section>
  );
};
export default Home;
