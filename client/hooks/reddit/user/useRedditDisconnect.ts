import { clearRedditUser } from "@/store/slices/userSlice";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export const useRedditDisconnect = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRedditDisconnect = async () => {
    console.log("Disconnecting Reddit account...");

    await signOut({ redirect: false });

    console.log("Reddit account disconnected.");

    dispatch(clearRedditUser());
    router.push("/");
  };

  return { handleRedditDisconnect };
};
