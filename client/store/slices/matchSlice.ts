import { MatchCandidate } from "@/types/match";
import { createSlice } from "@reduxjs/toolkit";

export interface MatchSlice {
  matches: MatchCandidate[];
  query: string;
  selectedMatch: MatchCandidate | null;
}

const initialState: MatchSlice = {
  matches: [],
  query: "I'm just browsing rn",
  selectedMatch: null,
};

export const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    setMatches: (state, action) => {
      state.matches = action.payload;
      state.selectedMatch = state.matches[0] || null;
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

        if (state.selectedMatch?.redditUsername === matchUsername) {
          state.selectedMatch = match;
        }
      }
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearQuery: (state) => {
      state.query = "I'm just browsing rn";
    },
    setSelectedMatch: (state, action) => {
      state.selectedMatch = action.payload;
    },
  },
});

export const {
  setMatches,
  clearMatches,
  setMatchExplanation,
  setQuery,
  clearQuery,
  setSelectedMatch,
} = matchSlice.actions;
export default matchSlice.reducer;
