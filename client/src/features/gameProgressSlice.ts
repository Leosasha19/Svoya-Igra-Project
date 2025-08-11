import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../redux/store/store.ts';
import { UserData } from './usersDataSlice.ts';
import axios from 'axios';

export interface GameProgressState {
  score: number;
  completedQuestions: number[];
  questionStatus: Record<number, 'correct' | 'wrong'>;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: GameProgressState = {
  score: 0,
  completedQuestions: [],
  questionStatus: {},
  status: 'idle',
};

export interface SaveProgressPayload {
  playerId: number;
  score: number;
  completedQuestions: number[];
  questionStatus: Record<number, 'correct' | 'wrong'>;
}

interface SaveProgressResponse {
  player: UserData;
}

export interface ApiError {
  message: string;
  status: number;
}

export const saveProgress = createAsyncThunk<
  SaveProgressResponse,
  SaveProgressPayload,
  { rejectValue: ApiError }
>('gameProgress/saveProgress',
  async (saveProgressData, { rejectWithValue }) => {
    try {
      const response = await axios.put<SaveProgressResponse>('/game-progress', saveProgressData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message || 'Неизвестная ошибка',
          status: error.response?.status || 500,
        });
      }
      return rejectWithValue({
        message: 'Ошибка при сохранение прогресса',
        status: 503,
      });
    }
  },
);

const gameProgressSlice = createSlice({
  name: 'gameProgress',
  initialState: initialState,
  reducers: {
    addScore: (state, action) => {
      state.score += action.payload;
    },
    completeQuestion: (state, action) => {
      const { questionId, isCorrect, newScore } = action.payload;
      state.completedQuestions.push(questionId);
      state.questionStatus[questionId] = isCorrect ? 'correct' : 'wrong';
      state.score = newScore;
    },
    resetGameProgress: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveProgress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveProgress.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(saveProgress.rejected, (state, action) => {
        state.status = 'failed';
        console.error('Ошибка:', action.payload);
      });
  },
});

export const { addScore, completeQuestion, resetGameProgress } = gameProgressSlice.actions;
export default gameProgressSlice.reducer;
export const selectGameProgress = (state: RootState) => state.gameProgress;
export const selectGameQuestionStatus = (state: RootState) => state.gameProgressQuestionStatus.questionStatus;
export const selectGameCompletedQuestions = (state: RootState) => state.gameProgressCompletedQuestions.completedQuestions;