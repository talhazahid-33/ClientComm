import React, { useState, useEffect } from "react";
import socket from "./sockets";
// Assuming the server is running on localhost:5000
//const socket = io("http://localhost:5000");

const ImageChat = () => {
  const [image, setImage] = useState(null); // Holds the selected image
  const [receivedImages, setReceivedImages] = useState([]); // Store received images

  // Handle file selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert image to base64
      reader.onloadend = () => {
        setImage(reader.result); // Set image data in state
      };
    }
  };

  // Send image via socket
  const handleSendImage = () => {
    if (image) {
      socket.emit("send_image", { image });
      setImage(null); // Clear selected image after sending
    }
  };

  useEffect(() => {
    // Receive images from the server
    socket.on("receive_image", (data) => {
      setReceivedImages((prevImages) => [...prevImages, data.image]); // Append received image to the array
    });

    return () => {
      socket.off("receive_image"); // Clean up the socket listener on component unmount
    };
  }, []);

  return (
    <div>
      <h1>Image Chat</h1>
      
      <input type="file" accept="image/*" onChange={handleImageSelect} />
      {image && (
        <div>
          <img src={image} alt="Selected" style={{ width: "100px", height: "100px" }} />
          <button onClick={handleSendImage}>Send Image</button>
        </div>
      )}
      
      <h2>Received Images</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {receivedImages.map((img, index) => (
          <img key={index} src={img} alt="Received" style={{ width: "100px", height: "100px", margin: "10px" }} />
        ))}
      </div>
    </div>
  );
};

export default ImageChat;
