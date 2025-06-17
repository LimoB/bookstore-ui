import { configureStore } from "@reduxjs/toolkit";
import { bookApi } from "../features/bookApi";

export const store = configureStore({
    reducer: {
        [bookApi.reducerPath]: bookApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(bookApi.middleware),
});

// Optional: add types for convenience
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
