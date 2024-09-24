import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Assuming the server is running on localhost:5000
//const socket = io("http://localhost:5000");
import socket from "./sockets";
const Chat = () => {
  const [message, setMessage] = useState(""); // Holds the text message
  const [file, setFile] = useState(null); // Holds the selected file
  const [receivedItems, setReceivedItems] = useState([]); // Stores received messages and files

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setFile({
          name: selectedFile.name,
          type: selectedFile.type,
          data: reader.result,
        }); 
      };
    }
  };

  // Handle sending a message (text or file)
  const handleSendMessage = () => {
    if (message) {
      // Sending a text message
      socket.emit("send_image", { type: "text", content: message });
      setMessage(""); // Clear message after sending
    } else if (file) {
      // Sending a file
      socket.emit("send_file", { type: "file", file });
      setFile(null); // Clear file after sending
    }
  };

  useEffect(() => {
    // Receive messages or files from the server
    socket.on("receive_item", (data) => {
      setReceivedItems((prevItems) => [...prevItems, data]); // Append received data (message or file)
    });

    return () => {
      socket.off("receive_item"); // Clean up the socket listener on component unmount
    };
  }, []);

  // Function to handle file download when clicked
  const handleFileDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  return (
    <div>
      <h1>Chat with Files</h1>

      {/* Text message input */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      
      {/* File upload */}
      <input type="file" onChange={handleFileSelect} />

      {/* Send button */}
      <button onClick={handleSendMessage}>Send</button>

      <h2>Received Messages and Files</h2>
      <div>
        {receivedItems.map((item, index) => (
          <div key={index}>
            {item.type === "text" ? (
              // Display text message
              <p>{item.content}</p>
            ) : (
              // Display file with download option
              <div>
                <p>{item.file.name}</p>
                <button onClick={() => handleFileDownload(item.file)}>Download</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
