import React, { useState, useEffect } from "react";
import AccountSettingsLinks from "../components/AccountSettingsLinks";
import "../styles/MyEvents.css";

const MyEvents = () => {
  const [activeTab, setActiveTab] = useState<string>("myevents");
  const handleTabClick = (tab: string) => setActiveTab(tab);

  return (
    <section>
      <h1 style={{ marginLeft: "40px", fontSize: "28px" }}>Account Settings</h1>
      <div className="myevents-container">
        <AccountSettingsLinks />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "82%",
          }}
        >
          <h2 style={{ margin: "15px 0 15px", fontSize: "32px" }}>My Events</h2>
          <div className="myevents-tabs">
            <a
              href="#myevents"
              className={activeTab === "myevents" ? "myevents-active" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("myevents");
              }}
            >
              My events
            </a>
            <a
              href="#upcomingevents"
              className={
                activeTab === "upcomingevents" ? "myevents-active" : ""
              }
              onClick={(e) => {
                e.preventDefault();
                handleTabClick("upcomingevents");
              }}
            >
              Upcoming events
            </a>
          </div>

          <div className="myevents-tab-content">
            {activeTab === "myevents" && (
              <div className="myevents-tab-pane">
                <h2>Уведомления</h2>
                <p>Настройки уведомлений.</p>
              </div>
            )}
            {activeTab === "upcomingevents" && (
              <div className="myevents-tab-pane">
                <h2>Уведом</h2>
                <p>Настройки уведомлений.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyEvents;
