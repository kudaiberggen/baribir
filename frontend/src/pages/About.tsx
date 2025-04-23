import { Link } from "react-router-dom";
import Friends from "../assets/about/friends.jpg";
import YesVector from "../assets/about/yes-vector.png";
import "../styles/About.css";

const About = () => {
  return (
    <section>
      <div className="about-image">
        <h1>About Us</h1>
      </div>
      <div className="aboutus-div">
        <div className="aboutus-left">
          <div className="special">About us</div>
          <h2>
            Bringing <span style={{ color: "#9D57FF" }}>People Together</span>
            <br />
            Through Experiences
          </h2>
          <p>
            Bar1b1r is a platform where you can create and join events, connect
            with <br />
            like-minded people, and turn every moment into a memory. <br />
            Whether you're looking for new friends, exciting experiences, or
            just a reason <br />
            to go out, we make it easy to explore and engage with your city.
          </p>
        </div>
        <div className="aboutus-right">
          <img src={Friends} alt="Friends" />
        </div>
      </div>
      <div className="ourmission-div">
        <div className="special">Our Mission</div>
        <div className="ourmission-text">
          <h2>
            We Believe That The Best <br />
            Experiences Are Shared
          </h2>
          <p>
            We created Bar1b1r to help people connect beyond <br />
            screens—through real-life events and shared moments. <br />
            Our goal is to make it easy for anyone to host, join, <br />
            and relive experiences with new and old friends.
          </p>
        </div>
      </div>
      <div className="whatwedo-div">
        <h2>What We Do?</h2>
        <div className="grid">
          <div className="item">
            <div className="number">01</div>
            <div className="line-container">
              <div className="line"></div>
              <div className="dot"></div>
            </div>
            <div className="title">Enable real-life connections</div>
            <div className="description">
              Bar1b1r makes it easy to discover, organize, and join events that
              bring people together based on shared interests.
            </div>
          </div>

          <div className="item">
            <div className="number">02</div>
            <div className="line-container">
              <div className="line"></div>
              <div className="dot"></div>
            </div>
            <div className="title">Build communities</div>
            <div className="description">
              From casual meetups to themed gatherings, Bar1b1r brings people
              together based on shared interests and vibes.
            </div>
          </div>

          <div className="item">
            <div className="number">03</div>
            <div className="line-container">
              <div className="line"></div>
              <div className="dot"></div>
            </div>
            <div className="title">Making cities more social</div>
            <div className="description">
              We help you explore your city in a new way—meet like-minded
              people, discover hidden spots, and turn ordinary days into
              something special.
            </div>
          </div>

          <div className="item">
            <div className="number">04</div>
            <div className="line-container">
              <div className="line"></div>
              <div className="dot"></div>
            </div>
            <div className="title">Inspire continuous discovery</div>
            <div className="description">
              Bar1b1r is about more than one event—it's about staying curious,
              finding new things to try, and making connections that grow over
              time.
            </div>
          </div>
        </div>
      </div>
      <div className="whybaribir-div">
        <div className="special">Why Bar1b1r?</div>
        <h2>Connecting People, Creating Memories</h2>
        <div className="purple-flex">
          <div className="purple">
            <img src={YesVector} alt="Yes Vector" />
            <h3>Easy & Intuitive</h3>
            <p>
              Simple event creation <br />
              and discovery.
            </p>
          </div>
          <div className="purple">
            <img src={YesVector} alt="Yes Vector" />
            <h3>Real connections</h3>
            <p>
              Meet people in real life, <br />
              not just online.
            </p>
          </div>
          <div className="purple">
            <img src={YesVector} alt="Yes Vector" />
            <h3>Personalized for you</h3>
            <p>
              Find events based on <br />
              your interests.
            </p>
          </div>
          <div className="purple">
            <img src={YesVector} alt="Yes Vector" />
            <h3>Always something new</h3>
            <p>
              Explore fresh <br />
              experiences and meet <br />
              new people.
            </p>
          </div>
        </div>
      </div>
      <div className="joinus-div">
        <h2>Join Us</h2>
        <p>Ready to start your next adventure?</p>
        <p>
          Find an event, create your own, and meet amazing <br />
          people along the way!
        </p>
        <Link to="/events">Get Started</Link>
      </div>
    </section>
  );
};

export default About;
