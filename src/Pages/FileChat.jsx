import React, { useState } from "react";
import axios from "axios";

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [base64String, setBase64String] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      convertFileToBase64(file);
    }
  };

  const convertFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setBase64String(reader.result);
      setSelectedFile(file);  // Optional: if you need file reference
    };
    reader.onerror = (error) => {
      console.error("Error converting file to base64: ", error);
    };
  };

  const handleUpload = async () => {
    if (!base64String) {
      console.log("No file selected");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/uploadfiles", {
        file: base64String,
      });

      console.log("Server Response: ", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <h3>Upload a Picture, Document, or Video</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {base64String && (
        <div>
          <p>Base64 Preview:</p>
          <textarea value={base64String} readOnly rows="5" style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
