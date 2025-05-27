import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {RootState} from "../redux/store/store.ts";

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
    error: "",
}

export const getQuestionsData = createAsyncThunk("questions/getQuestions", async (_, {rejectWithValue}) => {
    try {
        const questions = await axios('http://localhost:5001/game')
        console.log("get Questions data", questions.data);
        return questions.data
    } catch (error) {
        console.log("ОШИБКА ЗАПРОСА",error)
        return rejectWithValue(error);
    }
})

const QuestionsDataSlice = createSlice({
    name: "questions",
    initialState: initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getQuestionsData.pending,(state => {
                state.loading = true,
                    state.error = ""
            }))
            .addCase(getQuestionsData.fulfilled, ((state,action) => {
                state.loading = false,
                    state.error = "",
                    state.questions = action.payload
            }))
            .addCase(getQuestionsData.rejected, ((state, action: PayloadAction<string>) => {
                state.error = action.payload,
                    state.loading = false
            }))
    }
})

export default QuestionsDataSlice.reducer
export const selectAllQuestions = (state: RootState) => state.questionsData.questions
export const selectAllQuestionsError = (state: RootState) => state.questionsData.error
export const selectAllQuestionsLoading = (state: RootState) => state.questionsData.loading