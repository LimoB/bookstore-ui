import { configureStore } from "@reduxjs/toolkit";
import { bookApi } from "../features/bookApi";
import { authorApi } from "../features/authorApi";
import { userApi } from "../features/userApi";
import { genreApi } from "../features/genreApi";
import authReducer from "../features/authSlice"; // ⬅️ Import auth

export const store = configureStore({
  reducer: {
    auth: authReducer, // ⬅️ Add here
    [bookApi.reducerPath]: bookApi.reducer,
    [authorApi.reducerPath]: authorApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [genreApi.reducerPath]: genreApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      bookApi.middleware,
      authorApi.middleware,
      userApi.middleware,
      genreApi.middleware
    ),
});

// Types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
