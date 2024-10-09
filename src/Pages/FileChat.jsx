import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DeleteDialog from "../Components/Chat/DeleteDialog";
const HoverDeleteComponent = () => {
  const [hover, setHover] = useState(false);


  return (
    <div sx = {{ display: "flex",
      alignItems: "center",flexDirection : 'row'}}>
    <Box
      sx={{
        position: "relative",
        width: "300px",
        height: "100px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9f9f9",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#f0f0f0",
        },
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p>Hover over me to see the delete icon</p>

     
    </Box> 
    {hover && (
        <DeleteDialog/>
      )}
    </div>
  );
};

export default HoverDeleteComponent;
