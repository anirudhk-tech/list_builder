"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { MainState } from "@/store/store";
import Image from "next/image";
import { useRedditExplanation } from "@/hooks/reddit/user/useRedditExplanation";
import { setSelectedMatch } from "@/store/slices/matchSlice";

const fadeInVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function MatchPage() {
  const dispatch = useDispatch();
  const matches = useSelector((state: MainState) => state.match.matches);
  const selectedMatch = useSelector(
    (state: MainState) => state.match.selectedMatch
  );
  useRedditExplanation();

  return (
    <main className="flex flex-col w-full max-h-[150vh] min-h-[100vh] bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden font-sans">
      <Navbar />

      {/* MAIN GRID — header+footer subtract ~8rem (adjust if your navbar/footer differ) */}
      <section className="flex-1 container mx-auto px-4 py-2 md:py-6 grid md:grid-cols-6 gap-6 overflow-hidden">
        {/* Matches List */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:col-span-2 flex flex-col h-[90%] min-h-0 overflow-hidden"
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
                  onClick={() => dispatch(setSelectedMatch(match))}
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
          className="md:col-span-4 flex flex-col h-[100%] min-h-0 overflow-hidden"
        >
          {selectedMatch ? (
            <Card className="flex flex-col flex-1 h-full bg-gray-900/60 backdrop-blur-lg border-gray-800 rounded-3xl shadow-2xl">
              {/* ───────── Header ───────── */}
              <CardHeader className="border-b border-gray-800 flex items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Avatar className="h-10 w-10">
                    {selectedMatch.avatarUrl ? (
                      <Image
                        src={selectedMatch.avatarUrl}
                        alt={`${selectedMatch.redditUsername} avatar`}
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

                <button
                  className="bg-red-500 hover:bg-red-600 focus-visible:outline focus-visible:ring-2 focus-visible:ring-red-400
                 py-2 px-4 rounded-xl text-white text-sm font-medium transition"
                  onClick={() =>
                    window.open(
                      `https://reddit.com/u/${selectedMatch.redditUsername}`,
                      "_blank"
                    )
                  }
                >
                  View on Reddit
                </button>
              </CardHeader>

              {/* ───────── Content split ───────── */}
              <div className="flex-1 flex min-h-0 flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-800 overflow-hidden">
                <section
                  aria-labelledby="your-summary-heading"
                  className="flex-1 p-4 overflow-auto scrollbar-thin scrollbar-thumb-gray-700 [&::-webkit-scrollbar]:hidden"
                >
                  <h3
                    id="your-summary-heading"
                    className="text-gray-400 text-sm font-semibold mb-2"
                  >
                    Who They Are
                  </h3>
                  <p className="leading-relaxed whitespace-pre-wrap break-words text-gray-200">
                    {selectedMatch.summary || "No summary available."}
                  </p>
                </section>

                <section
                  aria-labelledby="match-explanation-heading"
                  className="flex-1 min-h-0 p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden"
                >
                  <h3
                    id="match-explanation-heading"
                    className="text-gray-400 text-sm font-semibold mb-2"
                  >
                    Why this matches
                  </h3>

                  {selectedMatch.explanation ? (
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={selectedMatch.explanation} // key so AnimatePresence sees it as “new”
                        variants={fadeInVariant}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="leading-relaxed whitespace-pre-wrap break-words text-gray-200"
                      >
                        {selectedMatch.explanation}
                      </motion.p>
                    </AnimatePresence>
                  ) : (
                    <p className="italic text-gray-500">
                      Generating explanation…
                    </p>
                  )}
                </section>
              </div>
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
