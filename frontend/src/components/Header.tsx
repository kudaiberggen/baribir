import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Logo from "/BariB1r.svg";
import Notification from "../assets/header/notification.png";
import Notifications from "./Notifications";
import "../styles/Header.css";

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(() => {
    return (
      localStorage.getItem("profile_image") ||
      "/media/profile_images/default.png"
    );
  });
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchNotificationCount = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/notifications/count",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch notification count");

        const count = await response.json();
        setNotificationCount(count);
      } catch (err) {
        console.error("Error fetching notification count:", err);
      }
    };

    fetchNotificationCount();
  }, [isAuthenticated]);

  const fetchProfileImage = () => {
    fetch("http://127.0.0.1:8000/api/user-info", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Ошибка от сервера:", response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const imageUrl =
          data.profile_image || "/media/profile_images/default.png";
        setProfileImage(imageUrl);
        localStorage.setItem("profile_image", imageUrl);
      })
      .catch((error) => {
        console.error("Ошибка при загрузке изображения профиля:", error);
        setProfileImage("/media/profile_images/default.png");
      });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfileImage();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header>
      <div className="nav-container">
        <NavLink to="/">
          <img src={Logo} alt="Company Logo" />
        </NavLink>

        <nav className="flex gap-4 items-center">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/events" className="nav-link">
            Events
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/my-events" className="nav-link">
              My events
            </NavLink>
          )}
          <NavLink to="/about" className="nav-link">
            About us
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            Contact us
          </NavLink>
        </nav>

        <div className="login-div">
          {isAuthenticated ? (
            <>
              <span style={{ position: "relative" }}>
                <img
                  src={Notification}
                  alt="Notification"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setNotificationOpen(!isNotificationOpen);
                    // if (!isNotificationOpen) setNotificationCount(0);
                  }}
                />
                {notificationCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      background: "red",
                      color: "white",
                      borderRadius: "50%",
                      padding: "2px 6px",
                      fontSize: "12px",
                    }}
                  >
                    {notificationCount}
                  </span>
                )}
              </span>
              {isNotificationOpen && <Notifications />}
              <div className="profile-container" ref={dropdownRef}>
                <img
                  src={profileImage}
                  alt="Profile"
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                />
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <NavLink to="/my-profile" className="dropdown-item">
                      My Profile
                    </NavLink>
                    <NavLink to="/my-events" className="dropdown-item">
                      My Events
                    </NavLink>
                    <NavLink to="/friends" className="dropdown-item">
                      Friends
                    </NavLink>
                    <NavLink to="/settings" className="dropdown-item">
                      Settings
                    </NavLink>
                    <button
                      className="dropdown-item logout-btn"
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>

              <NavLink to="/create-event" className="registration-link">
                Create event
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Log in
              </NavLink>
              <NavLink to="/registration" className="registration-link">
                Create An Account
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
