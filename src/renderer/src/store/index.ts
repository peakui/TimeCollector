import { configureStore } from '@reduxjs/toolkit'

import counterReducer from './modules/counterStore'

const store = configureStore({
  reducer: {
    counter: counterReducer
  }
})

// 导出 RootState 类型
export type RootState = ReturnType<typeof store.getState>

export default store
