import { useState } from "react";
import { useAuth } from "../components/AuthContext";
import "../styles/ChatFloatingButton.css";
import TemporaryPhoto from "../assets/about/friends.jpg";

const groupData = [
  {
    id: 1,
    name: "Social & Volunteering",
    image: TemporaryPhoto,
    messages: [
      { id: 1, text: "Hey! Let's organize something fun." },
      { id: 2, text: "Great idea! Picnic this weekend?" },
    ],
  },
  {
    id: 2,
    name: "Learning & Growth",
    image: TemporaryPhoto,
    messages: [
      { id: 1, text: "Who's joining the JavaScript workshop?" },
      { id: 2, text: "I am! Looks awesome." },
    ],
  },
];

const ChatFloatingButton = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(groupData[0]);
  const [messageInput, setMessageInput] = useState("");

  if (!isAuthenticated) return null;

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    setSelectedGroup((prevGroup) => ({
      ...prevGroup,
      messages: [...prevGroup.messages, { id: Date.now(), text: messageInput }],
    }));

    setMessageInput("");
  };

  return (
    <div className="chat-floating-wrapper">
      <button className="chat-float-button" onClick={() => setIsOpen(!isOpen)}>
        💬 Chats
      </button>

      {isOpen && (
        <div className="chat-modal">
          <div className="chat-header">
            <span className="chats-title">Chats</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-content">
            <div className="chat-first-content">
              {groupData.map((group) => (
                <div
                  key={group.id}
                  className={`chat-groups ${
                    selectedGroup.id === group.id ? "active-group" : ""
                  }`}
                  onClick={() => setSelectedGroup(group)}
                >
                  <img src={group.image} alt="" className="group-logo" />
                  {group.name}
                </div>
              ))}
            </div>

            <div className="chat-second-content">
              <div className="group-header">
                <img src={selectedGroup.image} alt="" className="group-logo" />
                <span className="group-title">{selectedGroup.name}</span>
              </div>

              <div className="group-messages">
                {selectedGroup.messages.map((msg) => (
                  <div key={msg.id} className="message-bubble">
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="message-input-container">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatFloatingButton;
