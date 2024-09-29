import React, { useState } from 'react';
import axios from 'axios';

const ImageChat = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [imagePath, setImagePath] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadStatus('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile); 
    try {
      const response = await axios.post('http://localhost:8000/uploadimage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('File uploaded successfully!');
      setImagePath(response.data.filePath); 
    } catch (error) {
      setUploadStatus('Error uploading file: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Upload</button>
      </form>

      {uploadStatus && <p>{uploadStatus}</p>}

      {imagePath && (
        <div>
          <h3>Uploaded Image</h3>
          <p>Image path: {imagePath}</p>
          <img src={`/${imagePath}`} alt="Uploaded" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </div>
  );
};

export default ImageChat;
