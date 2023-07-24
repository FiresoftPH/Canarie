import { createSlice } from "@reduxjs/toolkit";
import BIG_DATA from "../components/ChatUI/BigData.json";

import { nanoid } from "@reduxjs/toolkit";

const initState = BIG_DATA;

const bigDataSlice = createSlice({
  name: "bigData",
  initialState: initState,
  reducers: {
    // setCode: (state, action) => {
    // //   console.log(action.payload)
    // //   state.code = ""
    //   state.code = action.payload;
    // },
    addFiles: (state, action) => {
      // console.log(state.filter(sub => sub.course === action.payload.subjectId)[0].assignments.filter(ass => ass.assignmentId === action.payload.assignmentId)[0].files)
      const transformedData = state.map((sub) => {
        if (sub.course === action.payload.subjectId) {
          return {
            ...sub,
            files: [
              {
                id: nanoid(),
                name: action.payload.name,
                code: action.payload.code,
              },
              ...sub.files,
            ],
          };
        } else {
          return sub;
        }
      });

      return transformedData;
    },
    editFile: (state, action) => {
      const transformedData = state.map((sub) => {
        if (sub.course === action.payload.subjectId) {
          return {
            ...sub,
            files: sub.files.map((file) => {
              if (file.id === action.payload.fileId) {
                return {
                  ...file,
                  code: action.payload.code,
                };
              } else {
                return file;
              }
            }),
          };
        } else {
          return sub;
        }
      });

      return transformedData;
    },
    deleteFile: (state, action) => {
      const subId = action.payload.subjectId;
      const assId = action.payload.assignmentId;
      const fid = action.payload.fileId;

      const transformedData = state.map((sub) => {
        if (sub.course === subId) {
          return {
            ...sub,
            files: sub.files.filter((file) => file.id !== fid),
          };
        } else {
          return sub;
        }
      });

      return transformedData;
    },
    addChat: (state, action) => {
      const chatName = action.payload.name
      const subId = action.payload.subjectId;

      const transformedData = state.map((sub) => {
        if (sub.course === subId) {
          return {
            ...sub,
            assignments: [
              {
                assignmentId: nanoid(),
                name: chatName,
                chatHistory: []
              },
              ...sub["assignments"],
            ]
          };
        } else {
          return sub;
        }
      });

      return transformedData;
    },
    deleteChat: (state, action) => {
      const subId = action.payload.subjectId;
      const assId = action.payload.assignmentId

      const transformedData = state.map((sub) => {
        if (sub.course === subId) {
          return {
            ...sub,
            assignments: sub.assignments.filter(ass => ass.id !== assId)
          };
        } else {
          return sub;
        }
      });

      return transformedData;
    }
  },
});

// Action creators are generated for each case reducer function
export const bigDataAction = bigDataSlice.actions;
export default bigDataSlice.reducer;
