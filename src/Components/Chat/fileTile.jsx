import React, { useState } from "react";
import ImageDialog from "./ImageDialog";

import DoneAllSharpIcon from '@mui/icons-material/DoneAllSharp';
import DoneSharpIcon from '@mui/icons-material/DoneSharp';
import "./chat.css";
import DeleteDialog from "./DeleteDialog";

const FileTile = (props) => {
  const [imageDialogVis, setImageDialog] = useState(false);

  const handleImageDialog = () => {
    setImageDialog(!imageDialogVis);
  };

  const handleDownload = () => {
    console.log("Download: ", props.path);
    const link = document.createElement("a");

    link.href = "http://localhost:8000/" + props.path;
    link.download = props.path.split("/").pop();
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

    const [hover, setHover] = useState(false);
  return (
    <div
    key={props.index}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginRight: "",
        flexDirection: props.alignReverse ? "row-reverse" : "row",
      }}
    >
      <div className={`chat-container ${false ? "row-reverse" : ""}`}>
     
        <div className="upper-division">
          <span className="email">{props.username}</span>
          <span className="time">
          {props.time}
        </span>
          </div>

        <div className="lower-division">
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div>
              {props.path ? (
                <>
                  {props.type === "image" ? (
                    <>
                      <p>{props.name}</p>
                      <img
                        src={`http://localhost:8000/${props.path}`}
                        alt="Uploaded"
                        style={{ width: "140px", height: "120px" }}
                        onClick={handleImageDialog}
                      />
                      <ImageDialog
                        open={imageDialogVis}
                        name={props.name}
                        handleImageDialog={handleImageDialog}
                        path={`http://localhost:8000/${props.path}`}
                      />
                    </>
                  ) : (
                    <>
                      <b>
                        {" "}
                        <p onClick={handleDownload}>{props.name}</p>
                      </b>
                    </>
                  )}
                </>
              ) : (
                <p>No image available</p>
              )}
            </div>
            {!props.alignReverse ? null : props.seen ? (
              
              <DoneAllSharpIcon fontSize="small" color="primary"/>
            ) : (
              <DoneSharpIcon fontSize="small" />
            )}
          </div>
        </div>
      </div>
      {hover && (
          <DeleteDialog
            index={props.index}
            deleteMessage={props.deleteMessage}
            delForEveryone={props.alignReverse}
          />
        )}
    </div>
    </div>
  );
};

export default FileTile;
