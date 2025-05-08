import React, { useState, useEffect } from "react";
import "../styles/Notifications.css";

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/notifications/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch notifications");

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleAccept = async (requestId: string) => {
    try {
      await fetch(
        `http://127.0.0.1:8000/api/friend-request/accept/${requestId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.filter((n) => n.friend_request?.id !== requestId)
      );
    } catch (err) {
      console.error("Failed to accept friend request", err);
    }
  };

  const handleDeny = async (requestId: string) => {
    try {
      await fetch(
        `http://127.0.0.1:8000/api/friend-request/decline/${requestId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.filter((n) => n.friend_request?.id !== requestId)
      );
    } catch (err) {
      console.error("Failed to decline friend request", err);
    }
  };

  return (
    <div className="notifications-container">
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p>No new notifications.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className="notification-item">
              <div className="notification-text">
                <strong>{notification.title}</strong>
                <div>{notification.message}</div>
              </div>

              {notification.type === "friend_request" &&
                notification.friend_request && (
                  <div className="friend-request-actions">
                    <button
                      onClick={() =>
                        handleAccept(notification.friend_request.id)
                      }
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDeny(notification.friend_request.id)}
                    >
                      Deny
                    </button>
                  </div>
                )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
