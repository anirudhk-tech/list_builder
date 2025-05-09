import { setMatches } from "@/store/slices/matchSlice";
import { MainState } from "@/store/store";
import { MatchCandidate } from "@/types/match";
import { UserMatchRequest } from "@/types/supabase";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useRedditMatch = () => {
  const dispatch = useDispatch();
  const redditUsername = useSelector(
    (state: MainState) => state.user.redditUsername
  );
  const summary = useSelector((state: MainState) => state.user.summary);
  const [loading, setLoading] = useState(false);

  const handleFetchMatches = async (query: string) => {
    console.log("Fetching matches for query:", query);

    setLoading(true);
    try {
      const response = await fetch("/api/reddit/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          topK: 5,
          username: redditUsername,
          userSummary: summary,
        } as UserMatchRequest),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: { results: MatchCandidate[] } = await response.json();

      dispatch(setMatches(data.results));
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleFetchMatches,
  };
};
