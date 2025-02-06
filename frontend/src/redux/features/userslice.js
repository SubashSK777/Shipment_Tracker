import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        currProd: null,
    },
    reducers: {
        setCurrProd: (state, action) => {
            state.currProd = action.payload;
        },
    },
});

export const { toggleNavBar, setCurrProd } = userSlice.actions;