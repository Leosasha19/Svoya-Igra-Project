import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../redux/store/store.ts';
import type { ApiError } from './gameProgressSlice.ts';

const api = import.meta.env.VITE_API_URL;

export interface QuestionsData {
  id: number;
  text: string;
  answer: string;
  category: string;
  points: number;
}

export interface QuestionsDataState {
  questions: QuestionsData[];
  loading: boolean;
  error: string;
}

const initialState: QuestionsDataState = {
  questions: [],
  loading: false,
  error: '',
};

export const getQuestionsData = createAsyncThunk<
  QuestionsData[],
  void,
  { rejectValue: ApiError }
>('questions/getQuestions', async (_, { rejectWithValue }) => {
  try {
    const questions = await axios.get<QuestionsData[]>(`${api}/api/game`);
    return questions.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Неизвестная ошибка',
        status: error.response?.status || 500,
      });
    }
    return rejectWithValue({
      message: 'Ошибка при получени вопросов',
      status: 503,
    });
  }
});

const QuestionsDataSlice = createSlice({
  name: 'questions',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getQuestionsData.pending, (state => {
        state.loading = true;
        state.error = '';
      }))
      .addCase(getQuestionsData.fulfilled, ((state, action) => {
        state.loading = false;
        state.error = '';
        state.questions = action.payload;
      }))
      .addCase(getQuestionsData.rejected, ((state, action) => {
        state.loading = false;
        state.error = action.payload?.message ||
          'Произошла неизвестная ошибка при загрузке';
      }));
  },
});

export default QuestionsDataSlice.reducer;
export const selectAllQuestions = (state: RootState) => state.questionsData.questions;
export const selectAllQuestionsError = (state: RootState) => state.questionsData.error;
export const selectAllQuestionsLoading = (state: RootState) => state.questionsData.loading;