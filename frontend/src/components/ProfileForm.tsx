import React, { useState } from "react";
import "../styles/ProfileForm.css";

const interestsList = [
  "Music",
  "Sport",
  "Museum",
  "Exhibitions",
  "Concerts",
  "Festival",
  "Arts",
  "Culture",
  "Courses",
  "Parks",
  "K-pop",
  "Anime",
  "Books",
  "Master classes",
  "Stand-up",
  "Video games",
  "Board games",
  "Volunteering",
  "Theater",
  "Cinema",
  "Cooking",
  "Eco events",
  "Education",
];

const ProfileForm: React.FC = () => {
  const [gender, setGender] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <form className="profile-form">
      <h2 style={{ marginBottom: "10px" }}>Fill in the basic information</h2>

      <div className="form-row">
        <input type="text" placeholder="First name" />
        <input type="text" placeholder="Last name" />
      </div>

      <textarea placeholder="Bio" className="bio-input" />

      <h3 style={{ marginBottom: "10px" }}>Gender</h3>
      <div className="gender-buttons">
        <button
          type="button"
          className={gender === "Male" ? "selected male" : "male"}
          onClick={() => setGender("Male")}
        >
          Male
        </button>
        <button
          type="button"
          className={gender === "Female" ? "selected female" : "female"}
          onClick={() => setGender("Female")}
        >
          Female
        </button>
      </div>

      <h3 style={{ marginBottom: "10px" }}>Contact information</h3>
      <div className="form-row">
        <input type="text" placeholder="City" />
        <input type="email" placeholder="Email" />
      </div>
      <div className="form-row">
        <input type="text" placeholder="Phone number" />
        <input type="text" placeholder="Education" />
      </div>
      <div className="form-row">
        <input type="text" placeholder="Day" />
        <input type="text" placeholder="Month" />
        <input type="text" placeholder="Year" />
      </div>

      <h3 style={{ marginBottom: "10px" }}>Choose your interests</h3>
      <div className="interests-selected">
        {selectedInterests.map((i) => (
          <span key={i} className="tag">
            {i} <span onClick={() => toggleInterest(i)}>×</span>
          </span>
        ))}
      </div>
      <div className="interests-grid">
        {interestsList.map((interest) => (
          <button
            key={interest}
            type="button"
            className={`interest ${
              selectedInterests.includes(interest) ? "active" : ""
            }`}
            onClick={() => toggleInterest(interest)}
          >
            {interest}
          </button>
        ))}
      </div>

      <button type="submit" className="save-button">
        Save changes
      </button>
    </form>
  );
};

export default ProfileForm;
