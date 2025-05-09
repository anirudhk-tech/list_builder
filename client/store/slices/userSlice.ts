import { createSlice } from "@reduxjs/toolkit";

export interface UserSlice {
  redditUsername: string | null;
  summary: string | null;
  avatarUrl: string | null;
}

const initialState: UserSlice = {
  redditUsername: null,
  summary: null,
  avatarUrl: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRedditUser: (state, action) => {
      state.redditUsername = action.payload.redditUsername;
      state.summary = action.payload.summary;
      state.avatarUrl = action.payload.avatarUrl;
    },
    clearRedditUser: (state) => {
      state.redditUsername = null;
      state.summary = null;
      state.avatarUrl = null;
    },
  },
});

export const { setRedditUser, clearRedditUser } = userSlice.actions;
export default userSlice.reducer;
