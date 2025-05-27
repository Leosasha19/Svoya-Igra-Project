import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../redux/store/store.ts";
import axios from "axios";

export interface UserData {
    id: number | null;
    name: string;
    score: number;
    questionStatus: Record<number, "correct" | "wrong">;
    status: "idle" | "loading" | "failed";
}

export const initialState: UserData = {
    id: null,
    name: "",
    score: 0,
    questionStatus: {},
    status: "idle",
}

interface ProgressResponseData {
    player : {
        id: number,
        name: string,
        score: number,
        questionStatus: {},
    }
}
interface SaveProgressData {
    id: number,
    name: string,
    score: number,
    questionStatus: {},
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
            state.name = "";
            state.score = 0;
            state.questionStatus = {};
            state.status = "idle";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveUser.pending, (state) => {
                state.status = "loading";
            })
            .addCase(saveUser.fulfilled,(state, action: PayloadAction<SaveProgressData>) => {
                state.id = action.payload.id;
                state.name = action.payload.name;
                state.score = action.payload.score;
            })
            .addCase(saveUser.rejected, (state, action: PayloadAction<string>) => {
                console.error('Ошибка сохранения:', action.payload);
            })
            .addCase(getProgress.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getProgress.fulfilled, (state, action: PayloadAction<ProgressResponseData>) => {
                state.status = "idle";
                state.id = action.payload.player.id;
                state.name = action.payload.player.name;
                state.score = action.payload.player.score;
                state.questionStatus = action.payload.player.questionStatus;
            })
            .addCase(getProgress.rejected, (state, action: PayloadAction<string>) => {
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
