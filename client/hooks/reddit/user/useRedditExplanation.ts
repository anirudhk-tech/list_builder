import { MainState } from "@/store/store";
import { useSelector } from "react-redux";

export const useRedditExplanation = () => {
  const summary = useSelector((state: MainState) => state.user.summary);

  const handleExplain = async (
    matchSummary: string,
    score: string,
    query: string
  ) => {
    try {
      const response = await fetch("/api/reddit/explain", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
      return data.explanation;
    } catch (error) {
      console.error("Error fetching explanation:", error);
    }
  };

  return {
    handleExplain,
  };
};
