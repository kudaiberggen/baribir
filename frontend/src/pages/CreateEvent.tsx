import React, { useState } from "react";

interface EventData {
  title: string;
  description?: string;
  date: string;
  city?: string;
  address?: string;
  category?: number;
  photos?: File[];
}

const CreateEvent: React.FC = () => {
  const [formData, setFormData] = useState<EventData>({
    title: "",
    description: "",
    date: "",
    city: "",
    address: "",
    category: 0,
    photos: [] as File[],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, photos: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEvent(formData);
  };

  const createEvent = async (eventData: EventData) => {
    const formData = new FormData();
    formData.append("title", eventData.title);
    if (eventData.description)
      formData.append("description", eventData.description);
    formData.append("date", eventData.date);
    if (eventData.city) formData.append("city", eventData.city);
    if (eventData.address) formData.append("address", eventData.address);
    if (eventData.category)
      formData.append("category", eventData.category.toString());

    if (eventData.photos) {
      eventData.photos.forEach((photo) => {
        formData.append("photos", photo);
      });
    }

    // Проверка токена в localStorage
    const token = localStorage.getItem("access_token");
    console.log("Access token from localStorage:", token); // Логирование токена для отладки

    if (!token) {
      console.error("Access token is missing");
      return; // Если токен отсутствует, не выполняем запрос
    }

    try {
      const response = await fetch("http://localhost:8000/event/create/", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Event created successfully", data);
      } else {
        console.error("Error creating event", data);
      }
    } catch (error) {
      console.error("Request failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="Event Title"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleTextAreaChange}
        placeholder="Description"
      />
      <input
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleInputChange}
        required
      />
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
      <input
        type="number"
        name="category"
        value={formData.category}
        onChange={handleInputChange}
        placeholder="Category ID"
      />
      <input type="file" onChange={handleFileChange} multiple />
      <button type="submit">Create Event</button>
    </form>
  );
};

export default CreateEvent;
