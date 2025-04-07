import React, { useState, useEffect } from "react";
import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/Settings.css";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [profileImage, setProfileImage] = useState<string>(
    "/media/profile_images/default.png"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/user-info", {
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
      const response = await fetch("/api/change-photo", {
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
      const response = await fetch("/api/delete-photo", {
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

  return (
    <section>
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="mysettings-container">
        <AccountSettingsLinks />
        <div>
          <h2 style={{ marginLeft: "20px", fontSize: "24px" }}>Settings</h2>
          <div className="settings-container">
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
                href="#security"
                className={activeTab === "security" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick("security");
                }}
              >
                Notifications
              </a>
              <a
                href="#notifications"
                className={activeTab === "notifications" ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  handleTabClick("notifications");
                }}
              >
                Privacy and Security
              </a>
            </div>

            {/* Контент вкладок */}
            <div className="tab-content">
              {activeTab === "profile" && (
                <div className="tab-pane">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <img
                      src={profileImage}
                      alt="Current avatar"
                      style={{ width: "100px", borderRadius: "50%" }}
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <button onClick={handleUpload}>Upload photo</button>
                      <button onClick={handleDelete}>Delete avatar</button>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "security" && (
                <div className="tab-pane">
                  <h2>Безопасность</h2>
                  <p>Настройки безопасности.</p>
                </div>
              )}
              {activeTab === "notifications" && (
                <div className="tab-pane">
                  <h2>Уведомления</h2>
                  <p>Настройки уведомлений.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
