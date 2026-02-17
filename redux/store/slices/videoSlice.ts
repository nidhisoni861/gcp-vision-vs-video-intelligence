import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { DetectionResults } from '@/redux/types';
import { analyzeVideoApi } from '../../../services/videoApi';

export interface VideoState {
  results: DetectionResults | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: VideoState = {
  results: null,
  isLoading: false,
  error: null,
};

export const analyzeVideo = createAsyncThunk<
  DetectionResults,
  File,
  { rejectValue: string }
>(
  'video/analyzeVideo',
  async (file: File, { rejectWithValue }) => {
    const results = await analyzeVideoApi(file);
    if (results.error) {
      return rejectWithValue(results.error);
    }
    return results.data as DetectionResults;
  }
);

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    clearVideoResults: (state) => {
      state.results = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeVideo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.results = null;
      })
      .addCase(analyzeVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.results = action.payload;
      })
      .addCase(analyzeVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to analyze video';
        state.results = null;
      });
  },
});

export const { clearVideoResults } = videoSlice.actions;
export default videoSlice.reducer;
