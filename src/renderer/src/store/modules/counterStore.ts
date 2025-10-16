import { createSlice } from '@reduxjs/toolkit'

const counterStore = createSlice({
  name: 'lighter',
  initialState: {
    count: 2
  },
  reducers: {
    setLight(state) {
      state.count = 1
    },
    setNight(state) {
      state.count = 2
    }
  }
})

const { setLight, setNight } = counterStore.actions
const counterReducer = counterStore.reducer

export { setLight, setNight }
export default counterReducer
