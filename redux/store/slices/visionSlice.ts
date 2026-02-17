import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { DetectionResults } from '@/redux/types';
import { analyzeImageApi } from '@/services/visionApi';

export interface VisionState {
  results: DetectionResults | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: VisionState = {
  results: null,
  isLoading: false,
  error: null,
};

export const analyzeImage = createAsyncThunk<
  DetectionResults,
  File,
  { rejectValue: string }
>(
  'vision/analyzeImage',
  async (file: File, { rejectWithValue }) => {
    const results = await analyzeImageApi(file);
    if (results.error) {
      return rejectWithValue(results.error);
    }
    return results.data as DetectionResults;
  }
);

const visionSlice = createSlice({
  name: 'vision',
  initialState,
  reducers: {
    clearVisionResults: (state) => {
      state.results = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.results = null;
      })
      .addCase(analyzeImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.results = action.payload;
      })
      .addCase(analyzeImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to analyze image';
        state.results = null;
      });
  },
});

export const { clearVisionResults } = visionSlice.actions;
export default visionSlice.reducer;
