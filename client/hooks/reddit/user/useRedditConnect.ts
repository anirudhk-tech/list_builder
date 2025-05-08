import { setRedditUsername } from "@/store/slices/userSlice";
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
      dispatch(setRedditUsername(session.user.name));
      handleFetchRedditData().catch(console.error);
    }
  }, [session, dispatch, status, handleFetchRedditData]);

  const handleRedditConnect = async () => {
    console.log("Connecting to Reddit...");

    await signIn("reddit", { callbackUrl: "/" });

    console.log("Reddit connected!");
  };

  return { handleRedditConnect };
};
