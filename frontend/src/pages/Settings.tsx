import React, { useState, useEffect } from "react";
import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/Settings.css";
import ProfileForm from "../components/ProfileForm";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [isPrivate, setIsPrivate] = useState(true);
  const [profileImage, setProfileImage] = useState<string>(
    "/media/profile_images/default.png"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/user-info/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");

        if (!res.ok) {
          const text = await res.text();
          console.error("Ошибка ответа от сервера:", res.status, text);
          throw new Error(`Ошибка HTTP: ${res.status}`);
        }

        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Ожидался JSON, но получен:", text);
          throw new Error("Ответ сервера не в формате JSON");
        }

        return res.json();
      })
      .then((data) => {
        if (data.profile_image) {
          setProfileImage(data.profile_image);
        }
      })
      .catch((err) =>
        console.error("Ошибка при загрузке изображения профиля:", err)
      );
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("profile_image", selectedFile);

    try {
      const response = await fetch("/api/change-photo/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.profile_image);
        localStorage.setItem("profile_image", data.profile_image);
        alert("Photo updated successfully");
      } else {
        const errorText = await response.text();
        alert(`Failed to update photo: ${errorText}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error while uploading photo");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/delete-photo/", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.ok) {
        setProfileImage("/media/profile_images/default.png");
        localStorage.setItem(
          "profile_image",
          "/media/profile_images/default.png"
        );
        alert("Avatar deleted");
      } else {
        const errorText = await response.text();
        alert(`Failed to delete avatar: ${errorText}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error while deleting avatar");
    }
  };

  const handleTabClick = (tab: string) => setActiveTab(tab);
  const togglePrivacy = () => setIsPrivate((prev) => !prev);

  return (
    <section>
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="mysettings-container">
        <AccountSettingsLinks />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "82%",
          }}
        >
          <h2 style={{ margin: "15px 0 15px", fontSize: "32px" }}>Settings</h2>
          <div className="tabs">
            <a
              href="#profile"
              className={activeTab === "profile" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("profile");
              }}
            >
              Profile
            </a>
            <a
              href="#notifications"
              className={activeTab === "notifications" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("notifications");
              }}
            >
              Notifications
            </a>
            <a
              href="#privacy"
              className={activeTab === "privacy" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("privacy");
              }}
            >
              Privacy and Security
            </a>
            <a
              href="#payments"
              className={activeTab === "payments" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("payments");
              }}
            >
              Payments
            </a>
            <a
              href="#discovery"
              className={activeTab === "discovery" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("discovery");
              }}
            >
              Discovery
            </a>
          </div>

          {/* Контент вкладок */}
          <div className="tab-content">
            {activeTab === "profile" && (
              <div className="tab-pane">
                <img
                  src={profileImage}
                  alt="Current avatar"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                  }}
                />
                <p>Refresh the page to see your new avatar.</p>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    id="file-upload"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="file-upload" className="custom-button">
                    Select File
                  </label>

                  <button onClick={handleUpload} className="upload-button">
                    Upload photo
                  </button>
                  <button onClick={handleDelete} className="delete-button">
                    Delete avatar
                  </button>
                </div>
                <ProfileForm />
              </div>
            )}
            {activeTab === "notifications" && (
              <div className="tab-pane">
                <div className="notifications-row">
                  <div className="notifications-column">
                    <h2>SMS Notifications</h2>
                    <p>
                      📌 System updates may take up <br />
                      to 24 hours after unsubscribing, <br />
                      during which you may still receive messages.
                    </p>
                  </div>
                  <div className="notifications-column">
                    <label className="checkbox-container">
                      <input type="checkbox" name="checkbox" />
                      Reminders for registered events
                    </label>
                    <label className="checkbox-container">
                      <input type="checkbox" name="checkbox" />
                      Personalized event recommendations
                    </label>
                    <label className="checkbox-container">
                      <input type="checkbox" name="checkbox" />
                      Platform news and updates
                    </label>
                  </div>
                </div>
                <hr
                  style={{
                    width: "60%",
                    border: "none",
                    borderTop: "1px solid #e0e0e0",
                    margin: "0",
                  }}
                />
                <div className="notifications-row">
                  <div className="notifications-column">
                    <h2>Email Subscriptions</h2>
                    <p>Select the types of emails you want to receive:</p>
                  </div>
                  <div className="notifications-column">
                    <label className="checkbox-container">
                      <input type="checkbox" name="checkbox" />
                      Trending events in your city
                    </label>
                    <label className="checkbox-container">
                      <input type="checkbox" name="checkbox" />
                      Event recommendations based on your interests
                    </label>
                    <label className="checkbox-container">
                      <input type="checkbox" name="checkbox" />
                      Birthday and holiday greetings
                    </label>
                    <label className="checkbox-container">
                      <input type="checkbox" name="checkbox" />
                      Notifications about event changes (rescheduling,
                      cancellations, etc.)
                    </label>
                  </div>
                </div>
                <hr
                  style={{
                    width: "60%",
                    border: "none",
                    borderTop: "1px solid #e0e0e0",
                    margin: "0",
                  }}
                />
                <div className="notifications-row">
                  <div className="notifications-column">
                    <h2>Push Notifications</h2>
                    <p>
                      Instant alerts about important updates and <br />
                      events
                    </p>
                  </div>
                  <div className="notifications-column">
                    <label className="checkbox-container">
                      <input type="checkbox" name="checkbox" />
                      New messages from organizers or participants
                    </label>
                    <label className="checkbox-container">
                      <input type="checkbox" name="checkbox" />
                      Reminders for upcoming events
                    </label>
                    <label className="checkbox-container">
                      <input type="checkbox" name="checkbox" />
                      Someone is interested in your event
                    </label>
                    <label className="checkbox-container">
                      <input type="checkbox" name="checkbox" />
                      Event date, time, or location changes
                    </label>
                    <label className="checkbox-container">
                      <input type="checkbox" name="checkbox" />
                      Exclusive deals and promotions
                    </label>
                  </div>
                </div>
                <button type="submit" className="notification-button">
                  Save changes
                </button>
              </div>
            )}
            {activeTab === "privacy" && (
              <div className="tab-pane">
                <div className="privacy-content">
                  <h3>Account Details</h3>
                  <hr
                    style={{
                      width: "100%",
                      border: "none",
                      borderTop: "1px solid #e0e0e0",
                      margin: "0",
                    }}
                  />
                  <h3>Update Password</h3>
                  <p>Change your Password to update & protect your Account.</p>
                  <div className="privacy-row">
                    <input type="text" placeholder="New Password" />
                    <input type="text" placeholder="Confirm Password" />
                    <button type="submit" className="password-update-button">
                      Update
                    </button>
                  </div>
                </div>
                <div className="privacy-content">
                  <div className="privacy-toggle-wrapper">
                    <h3>Private account</h3>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={togglePrivacy}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <p>
                    When your account is public, your profile page can be seen
                    by anyone who use <br />
                    this application.
                  </p>
                  <p>
                    When your account is private, only the friends that you add
                    can see what you share, <br />
                    including your events and favorites.
                  </p>
                </div>
                <div className="privacy-content">
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div>
                      <h3>Deactivate Account</h3>
                      <p>
                        This will shut down your account. And it will reactivate
                        with Signing in.
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 0 0 50px",
                      }}
                    >
                      <button className="delete-button">Deactivate</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "payments" && (
              <div className="tab-pane">
                <h2>Уведомления</h2>
                <p>Настройки уведомлений.</p>
              </div>
            )}
            {activeTab === "discovery" && (
              <div className="tab-pane">
                <h2>Уведомления</h2>
                <p>Настройки уведомлений.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
