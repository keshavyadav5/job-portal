import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from './authSlice';
import jobSlice from './jobSlice';
import companySlice from './companySlice';
import applicationSlice from './applicationSlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apliSlice } from "@/utils/api/apiSlice";

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  [apliSlice.reducerPath]: apliSlice.reducer,
  auth: authSlice,
  job: jobSlice,
  company: companySlice,
  application: applicationSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apliSlice.middleware),
});

export default store;
