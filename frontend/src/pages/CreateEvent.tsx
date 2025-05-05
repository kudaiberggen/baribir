import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UploadIcon from "../assets/create-event/upload-icon.png";
import "../styles/CreateEvent.css";
import ArrowDown from "../assets/events/arrow-down.svg";
import ArrowUp from "../assets/events/arrow-up.svg";

interface EventData {
  title: string;
  description?: string;
  date: string;
  city?: string | number;
  address?: string;
  category?: string | number;
  price?: string;
  photos?: File[];
  isFree?: boolean;
  contactEmail?: string;
  contactPhone?: string;
}

const CreateEvent: React.FC = () => {
  const [formData, setFormData] = useState<EventData>({
    title: "",
    description: "",
    date: "",
    city: "",
    address: "",
    category: "",
    price: "",
    photos: [],
    isFree: false,
    contactEmail: "",
    contactPhone: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [categoriesList, setCategoriesList] = useState<
    { id: number; name: string }[]
  >([]);
  const [citiesList, setCitiesList] = useState<{ id: number; name: string }[]>(
    []
  );

  useEffect(() => {
    fetch("/api/categories/")
      .then((res) => res.json())
      .then((data) => setCategoriesList(data))
      .catch((err) => console.error("Ошибка при загрузке категорий:", err));

    fetch("/api/cities/")
      .then((res) => res.json())
      .then((data) => setCitiesList(data))
      .catch((err) => console.error("Ошибка при загрузке городов:", err));
  }, []);

  const handleSelectCategory = (categoryName: string) => {
    const category = categoriesList.find((c) => c.name === categoryName);
    if (category) {
      setSelectedCategory(category.name);
      setFormData({ ...formData, category: category.id });
    }
    setIsCategoryOpen(false);
  };

  const handleSelectCity = (cityName: string) => {
    const city = citiesList.find((c) => c.name === cityName);
    if (city) {
      setSelectedCity(city.name);
      setFormData({ ...formData, city: city.id });
    }
    setIsCityOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData({ ...formData, photos: files });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    if (!formData.photos || formData.photos.length < 3) {
      alert("Please upload at least 3 photos.");
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Missing access token.");
      return;
    }

    const formattedDate = selectedDate.toISOString();
    const payload = { ...formData, date: formattedDate };

    const formDataToSend = new FormData();
    formDataToSend.append("title", payload.title);
    formDataToSend.append("date", payload.date);
    if (payload.description)
      formDataToSend.append("description", payload.description);
    if (payload.city) formDataToSend.append("city", String(payload.city));
    if (payload.address) formDataToSend.append("address", payload.address);
    if (payload.category)
      formDataToSend.append("category", String(payload.category));
    if (payload.price && !payload.isFree)
      formDataToSend.append("price", payload.price);
    formDataToSend.append("isFree", String(payload.isFree));
    if (payload.contactEmail)
      formDataToSend.append("contactEmail", payload.contactEmail);
    if (payload.contactPhone)
      formDataToSend.append("contactPhone", payload.contactPhone);
    payload.photos?.forEach((file) => formDataToSend.append("photos", file));

    try {
      const response = await fetch("http://localhost:8000/api/event/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      let data: any = null;
      let errorText: string | null = null;

      try {
        data = await response.json(); // Пробуем прочитать как JSON
      } catch (err) {
        errorText = "Failed to parse JSON. Server might have returned HTML.";
      }

      if (response.ok) {
        alert("Event created successfully!");
        console.log(data);

        setFormData({
          title: "",
          description: "",
          date: "",
          city: "",
          address: "",
          category: "",
          price: "",
          photos: [],
          isFree: false,
          contactEmail: "",
          contactPhone: "",
        });
        setSelectedDate(null);
        setSelectedCategory(null);
        setSelectedCity(null);
      } else {
        console.error("Response not ok:", response.status);

        if (data) {
          alert(
            `Failed to create event: ${data?.detail || JSON.stringify(data)}`
          );
          console.log("Response data:", data);
        } else {
          alert(`Failed to create event: ${errorText}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the event.");
    }
  };

  return (
    <div className="create-event-container">
      <h1>Create event</h1>
      <hr
        style={{
          width: "100%",
          border: "none",
          borderTop: "1px solid #e0e0e0",
          margin: "0",
        }}
      />
      <form onSubmit={handleSubmit} className="create-event-form">
        <h2 style={{ marginBottom: "10px", fontSize: "24px" }}>Information</h2>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Event Title"
          required
          style={{ width: "580px" }}
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleTextAreaChange}
          placeholder="Description"
        />
        <h2 style={{ marginBottom: "10px", fontSize: "24px" }}>Location</h2>
        <div className="form-row">
          <div
            className="custom-dropdown-create-event"
            onClick={() => setIsCityOpen(!isCityOpen)}
          >
            <div className="dropdown-header-create-event">
              {selectedCity || "Select city"}
              <span className="arrow">
                <img src={isCityOpen ? ArrowUp : ArrowDown} alt="Arrow" />
              </span>
            </div>
            {isCityOpen && (
              <ul className="dropdown-list-create-event">
                {citiesList.map((city) => (
                  <li key={city.id} onClick={() => handleSelectCity(city.name)}>
                    {city.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
          />
        </div>
        <h2 style={{ marginBottom: "10px", fontSize: "24px" }}>Add photos</h2>
        <p style={{ fontSize: "16px", color: "#8C8C8C", margin: "0 0 15px 0" }}>
          Upload at least 3 photos
        </p>
        <div className="upload-card">
          <label htmlFor="file-upload" className="upload-zone">
            <img src={UploadIcon} alt="Upload Icon" style={{ width: "50px" }} />
            <p
              style={{
                fontWeight: "600",
                fontSize: "20px",
              }}
            >
              Choose a file or drag & drop it here.
            </p>
            <p
              style={{
                color: "#a0a0a0",
                fontSize: "16px",
                margin: "24px auto",
              }}
            >
              JPEG, PNG formats, up to 50MB
            </p>
            <span className="browse-button">Browse File</span>
            <input
              type="file"
              id="file-upload"
              style={{ display: "none" }}
              accept="image/png, image/jpeg"
              multiple
              onChange={handleFileChange}
            />
          </label>
        </div>
        <div className="form-row" style={{ marginTop: "10px" }}>
          <div style={{ width: "100%" }}>
            <h2 style={{ marginBottom: "15px", fontSize: "24px" }}>Category</h2>
            <div className="custom-select-wrapper">
              <div
                className="custom-dropdown-create-event"
                style={{ width: "100%" }}
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              >
                <div className="dropdown-header-create-event">
                  {selectedCategory || "Select category"}
                  <span className="arrow">
                    <img
                      src={isCategoryOpen ? ArrowUp : ArrowDown}
                      alt="Arrow"
                    />
                  </span>
                </div>
                {isCategoryOpen && (
                  <ul className="dropdown-list-create-event">
                    {categoriesList.map((category) => (
                      <li
                        key={category.id}
                        onClick={() => handleSelectCategory(category.name)}
                      >
                        {category.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div style={{ width: "100%" }}>
            <h2 style={{ marginBottom: "15px", fontSize: "24px" }}>
              Date and Time
            </h2>

            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd.MM.yyyy HH:mm"
              placeholderText="Select date and time"
              className="custom-datepicker"
            />
          </div>
        </div>

        <h2 style={{ marginBottom: "10px", fontSize: "24px" }}>Price</h2>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Enter price (₸)"
          disabled={formData.isFree}
          style={{ width: "580px" }}
        />
        <label className="checkbox-container">
          <input
            type="checkbox"
            name="isFree"
            checked={formData.isFree}
            onChange={handleInputChange}
          />
          The event is free, no ticket purchase is required.
        </label>
        <h2 style={{ marginBottom: "10px", fontSize: "24px" }}>Contacts</h2>
        <div className="form-row">
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            placeholder="Contact Email"
          />
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleInputChange}
            placeholder="Contact Phone"
          />
        </div>

        <button type="submit" className="create-event-btn">
          Create event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
