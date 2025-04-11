import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UploadIcon from "../assets/upload-icon.png";
import "../styles/CreateEvent.css";

const categories = [
  "Food & Drinks",
  "Fashion",
  "Sport",
  "Tech & IT",
  "Entertainment",
  "Culture & Arts",
  "Music",
  "Social & Volunteering",
  "Education",
  "Travel & Adventure",
];

interface EventData {
  title: string;
  description?: string;
  date: string;
  city?: string;
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
    photos: [] as File[],
    isFree: false,
    contactEmail: "",
    contactPhone: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "additional"
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (type === "main") {
        setFormData({ ...formData, photos: files });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate) {
      alert("Please select a date before submitting.");
      return;
    }

    const formattedDate = selectedDate.toISOString();
    const payload = { ...formData, date: formattedDate };

    const formDataToSend = new FormData();
    formDataToSend.append("title", payload.title);
    formDataToSend.append("date", payload.date);
    if (payload.description)
      formDataToSend.append("description", payload.description);
    if (payload.city) formDataToSend.append("city", payload.city);
    if (payload.address) formDataToSend.append("address", payload.address);
    if (payload.category)
      formDataToSend.append("category", Number(payload.category).toString());
    if (payload.isFree !== undefined)
      formDataToSend.append("isFree", payload.isFree.toString());
    if (payload.contactEmail)
      formDataToSend.append("contactEmail", payload.contactEmail);
    if (payload.contactPhone)
      formDataToSend.append("contactPhone", payload.contactPhone);

    payload.photos?.forEach((file) => {
      formDataToSend.append("photos", file);
    });

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Missing access token.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/event/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Event created!");
        console.log(data);
      } else {
        alert("Failed to create event");
        console.error(data);
      }
    } catch (err) {
      console.error("Error:", err);
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
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="City"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
          />
        </div>
        <h2 style={{ marginBottom: "10px", fontSize: "24px" }}>Add photos</h2>
        <p style={{ fontSize: "16px", color: "#8C8C8C" }}>
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
            <input type="file" id="file-upload" style={{ display: "none" }} />
          </label>
        </div>
        <h2 style={{ marginBottom: "10px", fontSize: "24px" }}>Category</h2>
        <div className="custom-select-wrapper">
          <select
            name="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: parseInt(e.target.value) })
            }
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat, index) => (
              <option key={index} value={index + 1}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <h2 style={{ marginBottom: "10px", fontSize: "24px" }}>
          Date and Time
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "2px dashed #d3d3d3",
            borderRadius: "12px",
            padding: "32px",
            maxWidth: "800px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <label
            style={{
              marginBottom: "12px",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            Select Date & Time
          </label>

          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd.MM.yyyy HH:mm"
            placeholderText="Select date and time"
            className="custom-datepicker"
          />
        </div>
        <h2 style={{ marginBottom: "10px", fontSize: "24px" }}>Price</h2>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Enter price (₸)"
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
        <input
          type="email"
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleInputChange}
          placeholder="Contact Email"
          style={{ width: "580px" }}
        />
        <input
          type="tel"
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleInputChange}
          placeholder="Contact Phone"
          style={{ width: "580px" }}
        />

        <button type="submit" className="create-event-btn">
          Create event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
