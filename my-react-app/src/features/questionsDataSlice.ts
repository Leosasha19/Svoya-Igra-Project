import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
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
    error: null | string;
}

const initialState: QuestionsDataState = {
    questions: [],
    loading: false,
    error: null,
}

export const getQuestionsData = createAsyncThunk("questions/getQuestions", async (_, {rejectWithValue}) => {
    try {
        const questions = await axios('http://localhost:5001/game')
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
                    state.error = null
            }))
            .addCase(getQuestionsData.fulfilled, ((state,action) => {
                state.loading = false,
                    state.error = null,
                    state.questions = action.payload
            }))
            .addCase(getQuestionsData.rejected, ((state, action) => {
                state.error = action.payload as string,
                    state.loading = false
            }))
    }
})

export default QuestionsDataSlice.reducer
export const selectAllQuestions = (state: RootState) => state.questionsData.questions
export const selectAllQuestionsError = (state: RootState) => state.questionsData.error
export const selectAllQuestionsLoading = (state: RootState) => state.questionsData.loading