import { createSlice } from "@reduxjs/toolkit";

const initialState = [{roomId: null, messages: []}];

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
      const room = state.find((room) => room.roomId === message.roomId);
      if (room) {
        room.messages.push(message);
      } else {
        state.push({ roomId: message.roomId, messages: [message] });
      }
    },
  },
});

export const { addMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
