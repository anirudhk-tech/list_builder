"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { MainState } from "@/store/store";
import { MatchCandidate } from "@/types/match";
import Image from "next/image";
import { useRedditExplanation } from "@/hooks/reddit/user/useRedditExplanation";
import { setMatchExplanation } from "@/store/slices/matchSlice";

export default function MatchPage() {
  const matches = useSelector((state: MainState) => state.match.matches);
  const dispatch = useDispatch();
  const query = useSelector((state: MainState) => state.match.query);
  const { handleExplain } = useRedditExplanation();
  const [selectedMatch, setSelectedMatch] = useState<MatchCandidate | null>(
    matches && matches.length ? matches[0] : null
  );

  useEffect(() => {
    const handleSelectedMatch = async () => {
      if (selectedMatch) {
        const { summary, score } = selectedMatch;
        const explanation = await handleExplain(
          summary,
          score.toString(),
          query
        );
        if (explanation) {
          dispatch(
            setMatchExplanation({
              matchUsername: selectedMatch.redditUsername,
              explanation,
            })
          );
        }
      }
    };

    handleSelectedMatch();
  }, [selectedMatch, query, handleExplain, dispatch]);

  return (
    <main className="flex flex-col h-screen max-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden font-sans">
      <Navbar />

      {/* MAIN GRID — header+footer subtract ~8rem (adjust if your navbar/footer differ) */}
      <section className="flex-1 container mx-auto px-4 py-2 md:py-6 grid md:grid-cols-6 gap-6 overflow-hidden">
        {/* Matches List */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:col-span-2 flex flex-col h-full min-h-0 overflow-hidden"
        >
          <h2 className="text-xl font-semibold mb-4">Your Matches</h2>
          <ScrollArea className="flex-1 pr-5 overflow-auto">
            <div className="space-y-4">
              {matches?.map((match) => (
                <Card
                  key={match.id}
                  className={`transition rounded-2xl border-gray-800 bg-gray-900/60 backdrop-blur-lg cursor-pointer hover:border-red-500/70 ${
                    selectedMatch?.id === match.id ? "border-red-500" : ""
                  }`}
                  onClick={() => setSelectedMatch(match)}
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <Avatar className="h-12 w-12">
                      {match.avatarUrl ? (
                        <Image
                          src={match.avatarUrl}
                          alt="Avatar"
                          width={48}
                          height={48}
                          className="rounded-full"
                          unoptimized
                        />
                      ) : (
                        <FaUserCircle className="h-full w-full" />
                      )}
                    </Avatar>
                    <div>
                      <CardTitle className="text-white leading-none mb-1">
                        {match.redditUsername}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <div className="mt-2 h-2 w-4/5 rounded-full bg-gray-800 overflow-hidden self-center">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${match.score}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-red-500"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:col-span-4 flex flex-col min-h-0 overflow-hidden"
        >
          {selectedMatch ? (
            <Card className="flex flex-col flex-1 bg-gray-900/60 backdrop-blur-lg border-gray-800 rounded-3xl shadow-2xl">
              <CardHeader className="border-b border-gray-800">
                <CardAction className="bg-red-500 py-2 px-4 rounded-xl text-white">
                  Find on Reddit
                </CardAction>
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Avatar className="h-10 w-10">
                    {selectedMatch.avatarUrl ? (
                      <Image
                        src={selectedMatch.avatarUrl}
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="rounded-full"
                        unoptimized
                      />
                    ) : (
                      <FaUserCircle className="h-full w-full" />
                    )}
                  </Avatar>
                  <span className="text-white">
                    {selectedMatch.redditUsername}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardDescription className="flex-1 p-4 text-gray-300">
                {selectedMatch.explanation ? (
                  <span>{selectedMatch.explanation}</span>
                ) : (
                  <span>Generating explanation...</span>
                )}
              </CardDescription>
            </Card>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a match to get a Sparky overview 💬
            </div>
          )}
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
