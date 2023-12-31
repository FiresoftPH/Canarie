import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  code: "",
  fid: "",
  shouldUpdate: true,
  prevAss: null,
  shouldDispatch: true
  //   assignment: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCode: (state, action) => {
    //   console.log(action.payload)
    //   state.code = ""
      // Object.assign(state.data,data)
      state.code = action.payload;
    },
    setFileId: (state, action) => {
      state.fid = action.payload
    },
    setShouldUpdate: (state, action) => {
      state.shouldUpdate = action.payload
    },
    setPrevAss: (state, action) => {
      state.prevAss = action.payload
    },
    setShouldDispatch: (state, action) => {
      state.shouldDispatch = action.payload
    }
  },
});

// Action creators are generated for each case reducer function
export const chatAction = chatSlice.actions;
export default chatSlice.reducer;
