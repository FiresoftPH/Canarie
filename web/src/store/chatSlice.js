import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  code: "",
  fid: ""
  //   assignment: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCode: (state, action) => {
    //   console.log(action.payload)
    //   state.code = ""
      state.code = action.payload;
    },
    setFileId: (state, action) => {
      state.fid = action.payload
    }
  },
});

// Action creators are generated for each case reducer function
export const chatAction = chatSlice.actions;
export default chatSlice.reducer;
