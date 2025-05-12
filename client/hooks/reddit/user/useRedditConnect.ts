import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRedditData } from "./useRedditData";

export const useRedditConnect = () => {
  const { data: session, status } = useSession();
  const { handleFetchRedditData } = useRedditData();
  const hasFetched = useRef(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      status === "authenticated" &&
      session.user.name &&
      !hasFetched.current
    ) {
      hasFetched.current = true;
      handleFetchRedditData().catch(console.error);
    }
  }, [session, dispatch, status, handleFetchRedditData]);

  const handleRedditConnect = async () => {
    localStorage.setItem("redditConnectLoading", "true"); // Because redirected, state does not work
    console.log("Connecting to Reddit...");

    await signIn("reddit", { callbackUrl: "/" });

    console.log("Reddit connected!");
  };

  return { handleRedditConnect };
};
