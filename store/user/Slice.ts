import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
type User = {
  id: string;
  public_id: string;
  email: string;
  name: string;
  img: string;
  role: string;
  address: string;
  provider: string;
  created_at : string
  [key: string]: string;
};
const initialState: User = {
  id: "",
  public_id: "",
  email: "",
  name: "",
  img: "",
  role: "",
  address: "",
  provider: "",
  created_at: ""
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      return action.payload ? action.payload : initialState;
    },
    clearUser: () => initialState, // إعادة حالة فارغة
  },
});

// تصدير الإجراءات
export const { setUser, clearUser } = userSlice.actions;

// تصدير المخفض (reducer) لاستخدامه في المتجر (store)
export default userSlice.reducer;
