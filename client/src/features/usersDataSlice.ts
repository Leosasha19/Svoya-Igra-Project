import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../redux/store/store.ts';
import axios from 'axios';
import { ApiError } from './gameProgressSlice.ts';

const api = import.meta.env.VITE_API_URL;

export interface UserData {
  id: number | null;
  name: string;
  score: number;
  questionStatus: Record<number, 'correct' | 'wrong'> | null;
  status: 'idle' | 'loading' | 'failed';
}

export const initialState: UserData = {
  id: null,
  name: '',
  score: 0,
  questionStatus: null,
  status: 'idle',
};

interface ProgressResponseData {
  player: {
    id: number,
    name: string,
    score: number,
    questionStatus: null,
  };
}

interface SaveProgressData {
  id: number,
  name: string,
  score: number,
  questionStatus: null,
}

interface saveUser {
  name: string;
  score: number;
}

export const getProgress = createAsyncThunk<
  ProgressResponseData,
  number,
  { rejectValue: ApiError }
>('user/getProgressUser',
  async (playerId, { rejectWithValue }) => {
    try {
      const response = await axios.get<ProgressResponseData>(`${api}/api/game-progress/${playerId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message || 'Неизвестная ошибка',
          status: error.response?.status || 500,
        });
      }
      return rejectWithValue({
        message: 'Ошибка при получении прогресса игры',
        status: 503,
      });
    }
  });

export const saveUser = createAsyncThunk<
  SaveProgressData,
  saveUser,
  { rejectValue: ApiError }
>('user/saveUser',
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${api}/api/players`, user);
      return response.data.player;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue({
          message: error.response?.data?.message || 'Неизвестная ошибка',
          status: error.response?.status || 500,
        });
      }
      return rejectWithValue({
        message: 'Ошибка при сохранении юзера',
        status: 503,
      });
    }
  });

export const UserDataSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    addUserScore(state, action) {
      state.score = action.payload;
    },
    resetUser(state) {
      state.id = null;
      state.name = '';
      state.score = 0;
      state.questionStatus = {};
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveUser.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.name = action.payload.name;
        state.score = action.payload.score;
      })
      .addCase(saveUser.rejected, (_, action) => {
        console.error('Ошибка сохранения:', action.payload);
      })
      .addCase(getProgress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getProgress.fulfilled, (state, action) => {
        state.status = 'idle';
        state.id = action.payload.player.id;
        state.name = action.payload.player.name;
        state.score = action.payload.player.score;
        state.questionStatus = action.payload.player.questionStatus;
      })
      .addCase(getProgress.rejected, (state, action) => {
        state.status = 'failed';
        console.error('Ошибка загрузки прогресса:', action.payload);
      });
  },
});

export const { addUserScore, resetUser } = UserDataSlice.actions;
export default UserDataSlice.reducer;
export const selectUserData = (state: RootState) => state.userData || initialState;
export const selectAddUserName = (state: RootState) => state.userData.name;
export const selectAddUserScore = (state: RootState) => state.userData.score;
