import { MatchCandidate } from "@/types/match";
import { createSlice } from "@reduxjs/toolkit";

export interface MatchSlice {
  matches: MatchCandidate[];
  query: string;
}

const initialState: MatchSlice = {
  matches: [],
  query: "I'm just browsing rn",
};

export const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setMatches: (state, action) => {
      state.matches = action.payload;
    },
    clearMatches: (state) => {
      state.matches = [];
    },
    setMatchExplanation: (state, action) => {
      const { matchUsername, explanation } = action.payload;
      const match = state.matches.find(
        (match) => match.redditUsername === matchUsername
      );
      if (match) {
        match.explanation = explanation;
      }
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearQuery: (state) => {
      state.query = "I'm just browsing rn";
    },
  },
});

export const {
  setMatches,
  clearMatches,
  setMatchExplanation,
  setQuery,
  clearQuery,
} = matchSlice.actions;
export default matchSlice.reducer;
