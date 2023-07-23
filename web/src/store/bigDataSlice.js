import { createSlice } from "@reduxjs/toolkit";
import BIG_DATA from "../components/ChatUI/BigData.json";

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
            assignments: sub.assignments.map((ass) => {
              if (ass.assignmentId === action.payload.assignmentId) {
                return {
                  ...ass,
                  files: [
                    ...ass["files"],
                    {
                      id: Math.random(),
                      name: action.payload.name,
                      code: action.payload.code,
                    },
                  ],
                };
              } else {
                return ass;
              }
            }),
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
            assignments: sub.assignments.map((ass) => {
              if (ass.assignmentId === action.payload.assignmentId) {
                return {
                  ...ass,
                  files: ass.files.map((f) => {
                    if (f.id === action.payload.fileId) {
                      return {
                        ...f,
                        code: action.payload.code,
                      };
                    } else {
                      return f;
                    }
                  }),
                };
              } else {
                return ass;
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
      const fid = action.payload.fileId;

      const transformedData = state.map((sub) => {
        if (sub.course === subId) {
          return {
            ...sub,
            files: sub.files.filter(file => file.id !== fid)
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
