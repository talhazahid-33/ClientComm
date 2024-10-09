import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
const initialState = [];

const messageSlice = createSlice({
  name: "messageSlice",
  initialState,
  reducers: {
    addMessages: (state, action) => {
      const newMessages = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      console.log("Action payload:", newMessages);

      newMessages.forEach((message) => {
        const room = state.find((room) => room.roomId === message.roomId);
        console.log("Processing message:", message);

        if (room) {
          console.log("Room found:", room.roomId);
          const isDuplicate = room.messages.find((msg) => msg.messageId === message.messageId);
          if (!isDuplicate) {
            room.messages.push(message);
          } else {
            console.log("Duplicate message, skipping:", message.messageId);
          }
        } else {
          console.log("Room not found, creating new room with roomId:", message.roomId);
          state.push({ roomId: message.roomId, messages: [message] });
        }
      });
    },
    addMessage: (state, action) => {
      const message = action.payload;
      console.log("Message Slice : ",message);
      const room = state.find((room) => room.roomId === message.roomId);
      if (room) {
        room.messages.push(message);
      } else {
        state.push({ roomId: message.roomId, messages: [message] });
      }
    },
  },
});

export const selectMessagesByRoomId = (state, roomId) => {
  const room = state.messages.find((room) => room.roomId === roomId);
  return room ? room.messages : [];
};

export const { addMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
