import { MainState } from "@/store/store";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { useRedditDisconnect } from "@/hooks/reddit/user/useRedditDisconnect";

export const Navbar: React.FC = () => {
  const redditUsername = useSelector(
    (state: MainState) => state.user.redditUsername
  );
  const { handleRedditDisconnect } = useRedditDisconnect();

  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <Link href="/" className="text-2xl font-bold tracking-tight">
        Flames<span className="text-red-500">AI</span>
      </Link>

      {redditUsername && (
        <Button
          className="bg-red-500 w-30 rounded-xl"
          onClick={handleRedditDisconnect}
        >
          Unlink Reddit
        </Button>
      )}
    </nav>
  );
};
