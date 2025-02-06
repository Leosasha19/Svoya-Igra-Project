import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../redux/store/store.ts";

export interface ChoiceGender {
    male : boolean,
    female : boolean,
}

const initialState: ChoiceGender = {
    male: true,
    female: false
}

export const choiceGenderSlice = createSlice({
    name: "gender",
    initialState: initialState,
    reducers: {
        choicedGender(state,action) {
            if(action.payload === true){
                state.male = true
                state.female = false
            } else {
                state.male = false
                state.female = true
            }
            console.log("male",state.male)
        }
    }
})

export const {choicedGender} = choiceGenderSlice.actions;
export default choiceGenderSlice.reducer
export const selectMaleGender = (state: RootState) => state.genderMale.male
export const selectFemaleGender = (state: RootState) => state.genderFemale.female