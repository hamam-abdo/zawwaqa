import { createSlice } from "@reduxjs/toolkit";

const initialState: number[] = [];

const lovesSlice = createSlice({
  name: "loves",
  initialState,
  reducers: {
    setLoves: (state, action) => {
      return action.payload; // تحميل البيانات من Supabase عند تسجيل الدخول
    },

    addLove: (state, action) => {
      const id = action.payload;
      if (!state.includes(id)) {
        state.push(id);
      }
    },

    removeLove: (state, action) => {
      const id = action.payload;
      return state.filter((item) => item !== id);
    },

    clearLoves: () => {
      return [];
    },
  },
});

export const { setLoves, addLove, removeLove, clearLoves } = lovesSlice.actions;

export default lovesSlice.reducer;
