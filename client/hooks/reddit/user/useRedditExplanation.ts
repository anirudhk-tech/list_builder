import { setMatchExplanation } from "@/store/slices/matchSlice";
import { MainState } from "@/store/store";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useRedditExplanation = () => {
  const selectedMatch = useSelector(
    (state: MainState) => state.match.selectedMatch
  );
  const summary = useSelector((state: MainState) => state.user.summary);
  const query = useSelector((state: MainState) => state.match.query);
  const dispatch = useDispatch();

  const handleExplain = useCallback(
    async (matchSummary: string, score: string) => {
      try {
        console.log("Explaining Reddit match...");

        const response = await fetch("/api/reddit/explain", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userSummary: summary,
            matchSummary,
            score,
            query,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch explanation");
        }

        const data = await response.json();

        console.log("Reddit match explained!");

        return data.explanation;
      } catch (error) {
        console.error("Error fetching explanation:", error);
      }
    },
    [summary, query]
  );

  const handleExplainSelectedMatch = useCallback(async () => {
    if (selectedMatch && !selectedMatch.explanation) {
      const { summary: matchSummary, score } = selectedMatch;
      const explanation = await handleExplain(matchSummary, score.toString());
      if (explanation) {
        dispatch(
          setMatchExplanation({
            matchUsername: selectedMatch.redditUsername,
            explanation,
          })
        );
      }
    }
  }, [dispatch, handleExplain, selectedMatch]);

  useEffect(() => {
    handleExplainSelectedMatch();
  }, [selectedMatch?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    handleExplain,
    handleExplainSelectedMatch,
  };
};
