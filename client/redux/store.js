import { configureStore, createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    user: null, // Stores username
    items: [],  // Stores tasks fetched from MongoDB
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setTasks: (state, action) => {
      state.items = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.items = [];
    }
  }
});

export const { setUser, setTasks, logout } = taskSlice.actions;

export const store = configureStore({
  reducer: {
    tasks: taskSlice.reducer
  }
});