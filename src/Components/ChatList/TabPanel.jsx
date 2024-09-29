import React, { useEffect } from "react";
import ChatRoom from "../Chat/chatRoom";
const TabPanelC = (props) => {
    const { children, value, index, roomid,UpdateRoomLastMessage,updateNewMessageCount, ...other } = props;
    useEffect(()=>console.log())
    if (!roomid) {
      return <></>; 
    }
  
    return (
      <div
        role="tabpanel"
        hidden={false}
        id={`vertical-tabpanel-${index}`}
      >
        <ChatRoom roomid={roomid} UpdateRoomLastMessage = {UpdateRoomLastMessage} updateNewMessageCount = {updateNewMessageCount} />
      </div>
    );
  };
  
  export default TabPanelC;
  