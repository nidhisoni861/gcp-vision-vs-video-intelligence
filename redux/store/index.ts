import { configureStore } from '@reduxjs/toolkit';
import visionReducer from './slices/visionSlice';
import videoReducer from './slices/videoSlice';

export const store = configureStore({
  reducer: {
    vision: visionReducer,
    video: videoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
