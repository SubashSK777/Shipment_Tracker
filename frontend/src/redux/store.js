import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./features/uislice";
import { userSlice } from "./features/userslice";

const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        user: userSlice.reducer,
    },
});

export default store;