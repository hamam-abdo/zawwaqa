import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TNotificationCom } from "@/types/shared";

const initialState: TNotificationCom[] = [];

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    // تحميل الكومنتات
    setcomment: (state, action: PayloadAction<TNotificationCom[]>) => {
      return action.payload;
    },

    // إضافة كومنت
    addcomment: (state, action: PayloadAction<TNotificationCom>) => {
      state.push(action.payload);
    },

    // حذف كومنت
    removecomment: (state, action: PayloadAction<string | number>) => {
      const id = Number(action.payload);
      return state.filter(item => Number(item.id) !== id);
    },

    // حذف كل الكومنتات
    clearcomment: () => {
      return [];
    },
  },
});

export const { setcomment, addcomment, removecomment, clearcomment } =
  commentSlice.actions;

export default commentSlice.reducer;
