import { authensAPI } from '@/apis/authens';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

const AI_KEY_STORAGE = 'ai_key';

export const fetchAIKey = createAsyncThunk('aiKey/fetchAIKey', async () => {
  let key = await SecureStore.getItemAsync(AI_KEY_STORAGE);
  if (!key) {
    key = await authensAPI.setAIKey();
    if (key) {
      await SecureStore.setItemAsync(AI_KEY_STORAGE, key);
    }
  }
  return key;
});

const aiKeySlice = createSlice({
  name: 'aiKey',
  initialState: {
    key: null as string | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIKey.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAIKey.fulfilled, (state, action) => {
        state.loading = false;
        state.key = action.payload;
      })
      .addCase(fetchAIKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch AI Key';
      });
  },
});
export default aiKeySlice.reducer;
