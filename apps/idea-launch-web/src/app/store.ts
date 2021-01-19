import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: (x) => ({ message: 'hello world' }),
  devTools: true,
})
