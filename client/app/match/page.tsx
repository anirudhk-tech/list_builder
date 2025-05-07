"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FaUserCircle } from "react-icons/fa";

interface Match {
  id: number;
  username: string;
  tagline?: string;
  score: number;
}

const dummyMatches: Match[] = [
  {
    id: 1,
    username: "tech_wizard",
    tagline: "AI + Programming Enthusiast",
    score: 80,
  },
  {
    id: 2,
    username: "book_nerd",
    tagline: "Fantasy & Sci‑fi Lover",
    score: 70,
  },
  {
    id: 3,
    username: "fitness_freak",
    tagline: "Gym • Calisthenics • Reddit",
    score: 15,
  },
  {
    id: 4,
    username: "memes_daily",
    tagline: "Dank meme curator 🧨",
    score: 33,
  },
  {
    id: 5,
    username: "memes_daily",
    tagline: "Dank meme curator 🧨",
    score: 33,
  },
  {
    id: 6,
    username: "memes_daily",
    tagline: "Dank meme curator 🧨",
    score: 33,
  },
  {
    id: 7,
    username: "memes_daily",
    tagline: "Dank meme curator 🧨",
    score: 33,
  },
];

export default function MatchPage() {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(
    dummyMatches[0]
  );

  return (
    <main className="flex flex-col max-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden font-sans">
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
              {dummyMatches.map((match) => (
                <Card
                  key={match.id}
                  className={`transition rounded-2xl border-gray-800 bg-gray-900/60 backdrop-blur-lg cursor-pointer hover:border-red-500/70 ${
                    selectedMatch?.id === match.id ? "border-red-500" : ""
                  }`}
                  onClick={() => setSelectedMatch(match)}
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <Avatar className="h-12 w-12">
                      <FaUserCircle className="h-full w-full" />
                    </Avatar>
                    <div>
                      <CardTitle className="text-white leading-none mb-1">
                        {match.username}
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-400 max-w-[9rem]">
                        {match.tagline}
                      </CardDescription>
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
                    <FaUserCircle className="h-full w-full" />
                  </Avatar>
                  <span className="text-white">{selectedMatch.username}</span>
                </CardTitle>
                <CardDescription className="text-white">
                  {selectedMatch.tagline}
                </CardDescription>
              </CardHeader>
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
