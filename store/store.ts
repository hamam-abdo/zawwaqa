import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/Slice";
import notification from "./notifications/Slice";
import userloves from "./loves/Slice";
import usercomment from "./comment/Slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    notification,
    loves: userloves,
    comment: usercomment,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
