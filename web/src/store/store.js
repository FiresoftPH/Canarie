import { configureStore } from '@reduxjs/toolkit'
import chatSlice from './chatSlice.js'
import userSlice from './userSlice.js'
import bigDataSlice from './bigDataSlice.js'

export const store = configureStore({
  reducer: {
    user: userSlice,
    chat: chatSlice,
    bigData: bigDataSlice
  },
})