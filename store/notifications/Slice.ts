import { createSlice } from "@reduxjs/toolkit";
import { TNotificationItem } from "@/types/shared";
// types.ts أو داخل نفس الملف

// الحالة الابتدائية (مصفوفة فاضية من الإشعارات)
const initialState: TNotificationItem[] = [];
const authSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setnotification(state, action) {
      return action.payload;
    },
    clearnotification() {
      return [];
    },
  },
});

export const { setnotification, clearnotification } = authSlice.actions;

export default authSlice.reducer;
