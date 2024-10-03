
import React, { useState, useRef } from 'react';
import { FaPaperclip } from 'react-icons/fa';

const FileInput = (props) => {
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef(null); 
  const documentInputRef = useRef(null); 
  const videoInputRef = useRef(null);

  const handleAttachmentClick = () => {
    setShowOptions((prev) => !prev);
  };

  const handleOptionSelect = (type) => {
    setShowOptions(false);
    if (type === 'Image') {
      fileInputRef.current.click(); 
    } else if (type === 'Document') {
      documentInputRef.current.click(); 
    }
    else if(type === 'Video'){
      videoInputRef.current.click();
    }
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0]
    if (file) {
      if (type === 'Image') {
        console.log("Selected image(s):", file);
        props.handleSelectedFile("image",file);
        
      } else if (type === 'Document') {
        console.log("Selected document(s):", file);
        props.handleSelectedFile("document",file);
      }
      else if(type === 'Video'){
        console.log("Selected Video ",file);
        props.handleSelectedFile("video",file);
      }

    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.icon} onClick={handleAttachmentClick}>
        <FaPaperclip />
      </div>
      {showOptions && (
        <div style={styles.options}>
          <div style={styles.option} onClick={() => handleOptionSelect('Image')}>
            📷 Image
          </div>
          <div style={styles.option} onClick={() => handleOptionSelect('Video')}>
            🎥 Video
          </div>
          <div style={styles.option} onClick={() => handleOptionSelect('Document')}>
            📄 Document
          </div>
          
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e, 'Image')}
        style={styles.fileInput}
        accept="image/*"
        hidden
      />
      <input
        type="file"
        ref={documentInputRef}
        onChange={(e) => handleFileChange(e, 'Document')}
        style={styles.fileInput}
        accept=".pdf,.doc,.docx,.txt"
        hidden
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={(e) => handleFileChange(e, 'Video')}
        style={styles.fileInput}
        accept="video/*"
        hidden
      />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    position: 'relative',
  },
  icon: {
    cursor: 'pointer',
    margin: '0 10px',
    fontSize: '20px',
  },
  fileInput: {
    display: 'none',
  },
  options: {
    position: 'absolute',
    top: '-80px',
    right: '0px', 
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  option: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #ddd',
    width: '130px',
    textAlign: 'center',
  },
};

export default FileInput;
