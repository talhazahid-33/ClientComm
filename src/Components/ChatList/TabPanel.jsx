import React, { useEffect } from "react";
import ChatRoom from "../Chat/chatRoom";
const TabPanelC = (props) => {
  const {
    children,
    value,
    index,
    roomid,
    UpdateRoomLastMessage,
    updateNewMessageCount,
    moveRoomToStart,
    ...other
  } = props;
  useEffect(() => console.log());
  if (!roomid) {
    return <></>;
  }

  return (
    <div role="tabpanel" hidden={false} id={`vertical-tabpanel-${index}`}>
      <ChatRoom
        roomid={roomid}
        UpdateRoomLastMessage={UpdateRoomLastMessage}
        updateNewMessageCount={updateNewMessageCount}
        moveRoomToStart = {moveRoomToStart}
      />
    </div>
  );
};

export default TabPanelC;
