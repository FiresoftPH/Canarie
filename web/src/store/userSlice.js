import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: 0,
  name: "",
  username: "",
  password: "",
  courses: [],
  status: "",
  loggedin: false
}

const userSlice = createSlice({
  name: 'user',             
  initialState,
  reducers: {
    // increment: (state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1
    // },
    // decrement: (state) => {
    //   state.value -= 1
    // },
    setUser: (state, action) => {
      state.id = action.payload.id
      state.name = action.payload.name
      state.username = action.payload.username
      state.password = action.payload.password
      state.status = action.payload.status
      state.loggedin = true

      // Doesn't work
      // state.courses = action.payload.courses
      state.courses = action.payload.courses
    },
    setUsername: (state, action) => {
      state.username = action.payload
    },
    addCourse: (state, action) => {
      state.courses.push(action.payload)
    },
    logout: (state) => {
      state.id = 0
      state.name = ""
      state.username = ""
      state.password = ""
      state.status = ""
      state.courses = []
      state.loggedin = false
    },
  },
})

// Action creators are generated for each case reducer function
export const userActions = userSlice.actions
export default userSlice.reducer