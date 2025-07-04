import React, { useState, useEffect } from "react";
import "../styles/ProfileForm.css";
import ArrowDown from "../assets/events/arrow-down.svg";
import ArrowUp from "../assets/events/arrow-up.svg";

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
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    city: "",
    email: "",
    phone: "",
    birthday: "",
    bio: "",
    gender: null as null | "Male" | "Female",
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("/api/cities/");
        const data = await res.json();
        if (res.ok) {
          setCities(data);
        } else {
          console.error("Failed to load cities:", data);
        }
      } catch (error) {
        console.error("City fetch error:", error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("/api/user-with-settings/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("Fetched user data:", data);

        if (res.ok) {
          setFormData({
            first_name: data.first_name,
            last_name: data.last_name,
            city: data.city || "",
            email: data.email,
            phone: data.phone,
            birthday: data.birthday ? data.birthday.slice(0, 10) : "",
            bio: data.bio || "",
            gender:
              data.gender === true
                ? "Male"
                : data.gender === false
                ? "Female"
                : null,
          });
          setSelectedCity(data.city || "");
          setSelectedInterests(data.interests || []);
        } else {
          console.error("Failed to load user data:", data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchCities();
    fetchUserInfo();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setFormData((prev) => ({ ...prev, city }));
    setIsCityOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

    const payload = {
      ...formData,
      gender:
        formData.gender === "Male"
          ? true
          : formData.gender === "Female"
          ? false
          : null,
      interests: selectedInterests,
    };

    try {
      const res = await fetch("/api/profile/update/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
      } else {
        const errorData = await res.json();
        console.error("Update failed:", errorData);
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: "10px" }}>Fill in the basic information</h2>

      <div className="form-row">
        <input
          type="text"
          placeholder="First name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Last name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
        />
      </div>

      <textarea
        placeholder="Bio"
        name="bio"
        className="bio-input"
        value={formData.bio}
        onChange={handleChange}
      />

      <h3 style={{ marginBottom: "10px" }}>Gender</h3>
      <div className="gender-buttons">
        <button
          type="button"
          className={formData.gender === "Male" ? "selected male" : "male"}
          onClick={() => setFormData({ ...formData, gender: "Male" })}
        >
          Male
        </button>
        <button
          type="button"
          className={
            formData.gender === "Female" ? "selected female" : "female"
          }
          onClick={() => setFormData({ ...formData, gender: "Female" })}
        >
          Female
        </button>
      </div>

      <h3 style={{ marginBottom: "10px" }}>Contact information</h3>
      <div className="form-row">
        <div
          className="custom-dropdown-cities"
          onClick={() => setIsCityOpen((prev) => !prev)}
        >
          <div className="dropdown-header-cities">
            {selectedCity || "Select city"}
            <span className="arrow">
              <img src={isCityOpen ? ArrowUp : ArrowDown} alt="Arrow" />
            </span>
          </div>
          {isCityOpen && (
            <ul className="dropdown-list-cities">
              {cities.map((city) => (
                <li
                  key={city.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCity(city.name);
                  }}
                >
                  {city.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <input
          type="text"
          placeholder="Phone number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="date"
          name="birthday"
          value={formData.birthday}
          onChange={handleChange}
          lang="en"
        />
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
