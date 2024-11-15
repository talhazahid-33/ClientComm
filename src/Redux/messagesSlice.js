import { createSlice } from "@reduxjs/toolkit";
const initialState = [];

const messageSlice = createSlice({
  name: "messageSlice",
  initialState,
  reducers: {
    addMessages: (state, action) => {
      const newMessages = action.payload;
      newMessages.forEach((message) => {
        const room = state?.find((room) => room.roomId === message.roomId);
        console.log("Processing message:", message);

        if (room) {
          console.log("Room found:", room.roomId);
          const isDuplicate = room.messages.find(
            (msg) => msg.messageId === message.messageId
          );
          if (!isDuplicate) {
            room.messages.push(message);
          } else {
            console.log("Duplicate message, skipping:", message.messageId);
          }
        } else {
          console.log(
            "Room not found, creating new room with roomId:",
            message.roomId
          );
          state?.push({ roomId: message.roomId, messages: [message] });
        }
      });
    },
    addMessage: (state, action) => {
      const message = action.payload;
      const room = state.find((room) => room.roomId === message.roomId);
      if (room) {
        room.messages.push(message);
      } else {
        state.push({ roomId: message.roomId, messages: [message] });
      }
    },
    removeMessage: (state, action) => {
      const message = action.payload;
      console.log("Message Slice : ", message);
      const room = state.find((room) => room.roomId === message.roomId);
      if (room) {
        room.messages = room.messages.filter(
          (msg) => msg.messageId !== message.messageId
        );
      } else console.log("Nothing to Delete");
    },
    deleteForEveryone: (state, action) => {
      const message = action.payload;
      console.log(message);
      
      const room = state.find((room) => room.roomId === message.roomId);
      if (room) {
        room.messages = room.messages.map((msg) => {
          if (msg.messageId === message.messageId)
            return {
              ...msg,
              message: "This message was deleted",
              type: "text",
              deleted: 1,
            };
          return msg;
        });
      } else console.log("Nothing to Update");
    },
    updateSeen: (state, action) => {
      const message = action.payload;
      console.log("Message Slice : ", message);
      const room = state.find((room) => room.roomId === message.roomId);
      if (room) {
        room.messages = room.messages.map((msg) => {
          if (msg.messageId === message.messageId) {
            return { ...msg, seen: true };
          }
          return msg;
        });
      } else console.log("No room to Update");
    },
    updateSeenForAll: (state, action) => {
      console.log("Update seen for all slice : ",action.payload);
      
      const { roomId, username } = action.payload;

      const room = state.find((room) => room.roomId === roomId);
      if (room) {
        room.messages = room.messages.map((msg) => {
          if (msg.sender !== username) {
            return {
              ...msg,
              seen: true,
            };
          }
          return msg;
        });
      } else console.log("No room to update Seen");
    },
  },
});

export const selectMessagesByRoomId = (state, roomId) => {
  const room = state.messages.find((room) => room.roomId === roomId);
  return room ? room.messages : [];
};

export const {
  addMessages,
  addMessage,
  removeMessage,
  deleteForEveryone,
  updateSeen,
  updateSeenForAll,
} = messageSlice.actions;
export default messageSlice.reducer;
