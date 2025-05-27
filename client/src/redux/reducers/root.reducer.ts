import {combineReducers} from "@reduxjs/toolkit";
import maleReducer from "../../features/choiceGenderSlice.ts"
import femaleReducer from "../../features/choiceGenderSlice.ts"
import addUserNameReducer from "../../features/usersDataSlice.ts"
import addUserScoreReducer from "../../features/usersDataSlice.ts"
import allQuestionsReducer from "../../features/questionsDataSlice.ts"
import userDataReducer from "../../features/usersDataSlice.ts"
import gameProgressReducer from "../../features/gameProgressSlice.ts"
import gameProgressQuestionStatusReducer from '../../features/gameProgressSlice.ts'
import gameProgressCompletedQuestionsReducer from '../../features/gameProgressSlice.ts'


export const rootReducer = combineReducers({
    genderMale: maleReducer,
    genderFemale: femaleReducer,
    addUserName: addUserNameReducer,
    addUserScore: addUserScoreReducer,
    questionsData: allQuestionsReducer,
    userData: userDataReducer,
    gameProgress: gameProgressReducer,
    gameProgressQuestionStatus: gameProgressQuestionStatusReducer,
    gameProgressCompletedQuestions: gameProgressCompletedQuestionsReducer
})