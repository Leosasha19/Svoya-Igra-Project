import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {RootState} from "../redux/store/store.ts";
import axios from "axios";

export interface UserData {
    id: number | null;
    name: string | null;
    score: number;
    questionStatus: Record<number, "correct" | "wrong">;
    status: "idle" | "loading" | "failed";
}

export const initialState: UserData = {
    id: null,
    name: null,
    score: 0,
    questionStatus: {},
    status: "idle",
}

export const getProgress = createAsyncThunk("user/getProgressUser",
    async (playerId: number, {rejectWithValue}) => {
    try {
        const response = await axios.get(`http://localhost:5001/api/game-progress/${playerId}`)
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Ошибка при загрузке прогресса");
    }
    })

export const saveUser = createAsyncThunk("user/saveUser",
    async (user: {name: string, score: number}, {rejectWithValue}) => {
     try {
         const response = await axios.post('http://localhost:5001/api/players', user)
         return response.data;
     } catch (error: any) {
         return rejectWithValue(error.response?.data || 'Ошибка при сохранении');
     }
    })

export const UserDataSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        addUserScore (state, action) {
            state.score = action.payload
        },
        resetUser (state) {
            state.id = null;
            state.name = null;
            state.score = 0;
            state.questionStatus = {};
            state.status = "idle";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveUser.pending, (state) => {

            })
            .addCase(saveUser.fulfilled,(state, action) => {
                state.id = action.payload.id;
                state.name = action.payload.name;
                state.score = action.payload.score;
            })
            .addCase(saveUser.rejected, (state, action) => {
                console.error('Ошибка сохранения:', action.payload);
            })
            .addCase(getProgress.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getProgress.fulfilled, (state, action) => {
                state.status = "idle";
                state.id = action.payload.player.id;
                state.name = action.payload.player.name;
                state.score = action.payload.player.score;
                state.questionStatus = action.payload.player.questionStatus;
            })
            .addCase(getProgress.rejected, (state, action) => {
                state.status = "failed";
                console.error("Ошибка загрузки прогресса:", action.payload);
            });
    }
})

export const { addUserScore, resetUser } = UserDataSlice.actions;
export default UserDataSlice.reducer;
export const selectUserData = (state: RootState) =>  state.userData || initialState
export const selectAddUserName = (state: RootState) => state.userData.name;
export const selectAddUserScore = (state: RootState) => state.userData.score;
