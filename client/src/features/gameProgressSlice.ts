import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {api} from "../api.ts";
import {RootState} from "../redux/store/store.ts";

export interface GameProgressState {
    score: number;
    completedQuestions: number[];
    questionStatus: Record<number, "correct" | "wrong">;
    status: "idle" | "loading" | "failed";
}

const initialState: GameProgressState = {
    score : 0,
    completedQuestions: [],
    questionStatus: {},
    status: "idle",
}

export const saveProgress = createAsyncThunk("gameProgress/saveProgress",
    async ({ playerId, score, questionStatus }: { playerId: number; score: number; questionStatus: Record<number, "correct" | "wrong">},{rejectWithValue}) => {
        try {
            const response = await api.put("/game-progress", {playerId, score, questionStatus})
            return response.data;
        } catch (error: any) {
            console.error("Ошибка сохранения:", error);
            return rejectWithValue(error.response?.data || "Ошибка сервера");
        }
    }
    );

const gameProgressSlice = createSlice({
    name: "gameProgress",
    initialState: initialState,
    reducers: {
        addScore: (state, action) => {
            state.score += action.payload;
        },
        completeQuestion: (state, action) => {
            const { questionId, isCorrect, newScore } = action.payload;
            state.completedQuestions.push(questionId);
            state.questionStatus[questionId] = isCorrect ? "correct" : "wrong";
            state.score = newScore;
        },
        resetGameProgress: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveProgress.pending, (state) => {
                state.status = "loading";
            })
            .addCase(saveProgress.fulfilled, (state) => {
                state.status = "idle";
            })
            .addCase(saveProgress.rejected, (state, action: PayloadAction<string>) => {
                state.status = "failed";
                console.error("Ошибка:", action.payload);
            });
    }
})

export const {addScore, completeQuestion, resetGameProgress} = gameProgressSlice.actions;
export default gameProgressSlice.reducer;
export const selectGameProgress = (state: RootState) => state.gameProgress;
export const selectGameQuestionStatus = (state: RootState) => state.gameProgressQuestionStatus.questionStatus;
export const selectGameCompletedQuestions = (state: RootState) => state.gameProgressCompletedQuestions.completedQuestions