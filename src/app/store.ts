// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { bookApi } from "../features/bookApi";
import { authorApi } from "../features/authorApi";
import { userApi } from "../features/userApi";

export const store = configureStore({
  reducer: {
    [bookApi.reducerPath]: bookApi.reducer,
    [authorApi.reducerPath]: authorApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      bookApi.middleware,
      authorApi.middleware,
      userApi.middleware
    ),
});

// Types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
