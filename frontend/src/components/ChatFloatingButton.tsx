import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthContext";
import "../styles/ChatFloatingButton.css";

interface Message {
  id: number;
  text: string;
  sender: string;
}

interface ChatGroup {
  id: number;
  name: string;
  image: string;
  messages: Message[];
}

const ChatFloatingButton = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState<ChatGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchChats = async () => {
      try {
        const response = await fetch("/api/chats/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const data = await response.json();

        const chatDetails = await Promise.all(
          data.map(async (chat: any) => {
            const detailRes = await fetch(`/api/chats/${chat.id}/`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            });
            const detailData = await detailRes.json();
            return {
              id: detailData.id,
              name: detailData.name,
              image: "/default-avatar.png", // replace with real image if available
              messages: detailData.messages.map((msg: any) => ({
                id: msg.id,
                text: msg.content,
                sender: msg.sender,
              })),
            };
          })
        );

        setChats(chatDetails);
        if (chatDetails.length > 0) setSelectedGroup(chatDetails[0]);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };

    fetchChats();
  }, [isAuthenticated]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedGroup) return;

    try {
      const response = await fetch(`/api/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          chat: selectedGroup.id,
          content: messageInput,
        }),
      });

      if (response.ok) {
        const newMsg = await response.json();
        const newMessage = {
          id: newMsg.id,
          text: newMsg.content,
          sender: newMsg.sender,
        };
        setSelectedGroup((prevGroup) =>
          prevGroup
            ? { ...prevGroup, messages: [...prevGroup.messages, newMessage] }
            : prevGroup
        );
        setMessageInput("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    // <div className="chat-floating-wrapper">
    //   <button className="chat-float-button" onClick={() => setIsOpen(!isOpen)}>
    //     💬 Chats
    //   </button>

    //   {isOpen && (
    //     <div className="chat-modal">
    //       <div className="chat-header">
    //         <span className="chats-title">Chats</span>
    //         <button onClick={() => setIsOpen(false)}>✕</button>
    //       </div>

    //       <div className="chat-content">
    //         <div className="chat-first-content">
    //           {groupData.map((group) => (
    //             <div
    //               key={group.id}
    //               className={`chat-groups ${
    //                 selectedGroup.id === group.id ? "active-group" : ""
    //               }`}
    //               onClick={() => setSelectedGroup(group)}
    //             >
    //               <img src={group.image} alt="" className="group-logo" />
    //               {group.name}
    //             </div>
    //           ))}
    //         </div>

    //         <div className="chat-second-content">
    //           <div className="group-header">
    //             <img src={selectedGroup.image} alt="" className="group-logo" />
    //             <span className="group-title">{selectedGroup.name}</span>
    //           </div>

    //           <div className="group-messages">
    //             {selectedGroup.messages.map((msg) => (
    //               <div key={msg.id} className="message-bubble">
    //                 {msg.text}
    //               </div>
    //             ))}
    //           </div>

    //           <div className="message-input-container">
    //             <input
    //               type="text"
    //               value={messageInput}
    //               onChange={(e) => setMessageInput(e.target.value)}
    //               placeholder="Type your message..."
    //               onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
    //             />
    //             <button onClick={handleSendMessage}>Send</button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className="chat-floating-wrapper">
      <button className="chat-float-button" onClick={() => setIsOpen(!isOpen)}>
        💬 Chats
      </button>

      {isOpen && selectedGroup && (
        <div className="chat-modal">
          <div className="chat-header">
            <span className="chats-title">Chats</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-content">
            <div className="chat-first-content">
              {chats.map((group) => (
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
                    <strong>{msg.sender}:</strong> {msg.text}
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
