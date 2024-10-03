import { configureStore, combineReducers } from '@reduxjs/toolkit';
import RoomsSlice from './RoomsSlice';
import messagesSlice from './messagesSlice';

const rootReducer = combineReducers({
  rooms: RoomsSlice,
  messages: messagesSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});

export default store;
