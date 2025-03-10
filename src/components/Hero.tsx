import "../styles/Hero.css";
import GetStartedImage from "../assets/DJ.jpg";
import Magnifier from "../assets/magnifier.png";
import Handshake from "../assets/handshake.png";
import Ticket from "../assets/ticket.png";

const Hero = () => {
  return (
    <section>
      <div className="getstarted">
        <img
          src={GetStartedImage}
          alt="Background"
          className="background-image"
        />
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
          <a href="#">Get Started</a>
        </div>
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
              Bar1bir makes it easier than ever to discover exciting events,
              meet like-minded people, and create unforgettable memories—all in
              one seamless platform designed for real connections.
            </p>
          </div>

          <div className="features-cards">
            <div className="feature-card">
              <div className="icon"></div>
              <h3>Personalized Recommendations</h3>
              <p>
                Get event suggestions tailored to your interests, location, and
                past activities so you never miss out on something exciting.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon"></div>
              <h3>Easy Event Creation</h3>
              <p>
                Whether it's a small gathering or a large meetup, organizing
                events takes just a few clicks—invite people, set details, and
                bring your ideas to life.
              </p>
            </div>

            <div className="feature-card">
              <div className="icon"></div>
              <h3>My Memories</h3>
              <p>
                Save your favorite events, revisit past experiences, and keep
                track of the moments that matter most.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
