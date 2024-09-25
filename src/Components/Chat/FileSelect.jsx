import React, { useState } from 'react';

const FileSelect = ({ onFileSelect, onClose }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            onFileSelect(selectedFile);
            onClose(); 
        }
    };

    return (
        <div className="file-select-modal">
            <h2>Select a Document</h2>
            <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.png,.JPEG" 
                onChange={handleFileChange}
            />
            <button onClick={handleUpload}>Upload</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
};

export default FileSelect;
