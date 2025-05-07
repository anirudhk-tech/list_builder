import { createSlice } from "@reduxjs/toolkit";

export interface UserSlice {
  redditUsername: string | null;
}

const initialState: UserSlice = {
  redditUsername: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setRedditUsername: (state, action) => {
      state.redditUsername = action.payload;
    },
    clearRedditUsername: (state) => {
      state.redditUsername = null;
    },
  },
});

export const { setRedditUsername, clearRedditUsername } = userSlice.actions;
export default userSlice.reducer;
