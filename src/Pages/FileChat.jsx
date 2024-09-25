import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Assuming the server is running on localhost:5000
//const socket = io("http://localhost:5000");
import socket from "./sockets";
import context from "react-bootstrap/esm/AccordionContext";
const Chat = () => {
  const [message, setMessage] = useState(""); 
  const [file, setFile] = useState(null); 
  const [receivedItems, setReceivedItems] = useState([]); 

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

  const handleSendMessage = () => {
    if (message) {
        setReceivedItems((prev) => [...prev, {type:"text",content:message}]);

      socket.emit("send_image", { type: "text", content: message });
      setMessage(""); 
    } else if (file) {
        console.log("file",file);
      socket.emit("send_file", { type: "file", file });
      setFile(null); 
    }
  };

  useEffect(() => {
    socket.on("receive_item", (data) => {
        
        console.log("file",data);
        console.log("all ",receivedItems);
      setReceivedItems((prevItems) => [...prevItems, data]); 
    });

    return () => {
      socket.off("receive_item"); 
    };
  }, []);

  const handleFileDownload = (file) => {
    const link = document.createElement("a");
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  return (
    <div>
      <h1>Chat with Files</h1>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      
      <input type="file" onChange={handleFileSelect} />

      <button onClick={handleSendMessage}>Send</button>

      <h2>Received Messages and Files</h2>
      <div>
        {receivedItems.map((item, index) => (
          <div key={index}>
            {item.type === "text" ? (
              <p>{item.content}</p>
            ) : (
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
