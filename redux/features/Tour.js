import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    stepCount: 0,
    tourRun: true,
};

export const tour = createSlice({
    name: "tour",
    initialState: initialState,
    reducers: {
        setTour: (state, action) => {
            return {
                ...state,
                stepCount: action.payload.stepCount,
                tourRun: action.payload.tourRun,
            };
        }
    },
});

export const { setTour } = tour.actions;

export default tour.reducer;

