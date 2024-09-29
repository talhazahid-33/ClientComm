import { configureStore,combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import RoomsSlice from './RoomsSlice';
import messagesSlice from './messagesSlice';

const rootReducer = combineReducers({
    rooms: RoomsSlice,
    messages:messagesSlice,
  });

const persistConfig = {
    key: 'root',
    storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;