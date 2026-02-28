import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore, createSlice } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

// 1. The Slice (same as before)
const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    user: null,
    items: [],
  },
  reducers: {
    setUser: (state, action) => { state.user = action.payload; },
    setTasks: (state, action) => { state.items = action.payload; },
    logout: (state) => {
      state.user = null;
      state.items = [];
    }
  }
});

export const { setUser, setTasks, logout } = taskSlice.actions;

// 2. Persistence Config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  tasks: taskSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3. Store with Middleware fix (prevents Redux from complaining about non-serializable data)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);