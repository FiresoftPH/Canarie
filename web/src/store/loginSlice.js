import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false
};

const loginSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.loggedIn = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const loginAction = loginSlice.actions;
export default loginSlice.reducer;
