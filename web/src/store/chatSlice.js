import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  code: "",
  //   assignment: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCode: (state, action) => {
      state.code = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const chatAction = chatSlice.actions;
export default chatSlice.reducer;
