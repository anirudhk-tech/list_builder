"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FaReddit } from "react-icons/fa";
import { FaFireFlameCurved } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { MainState } from "@/store/store";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useState } from "react";
import { ConsentDialog } from "@/components/features/home/consent-dialog";
import { useRouter } from "next/navigation";
import { useRedditMatch } from "@/hooks/reddit/user/useRedditMatch";
import { setQuery } from "@/store/slices/matchSlice";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const matchQuery = useSelector((state: MainState) => state.match.query);
  const [consentDialogOpen, setConsentDialogOpen] = useState(false);

  const redditUsername = useSelector(
    (state: MainState) => state.user.redditUsername
  );
  const { handleFetchMatches } = useRedditMatch();

  const handleFindMatches = async () => {
    if (matchQuery.trim().length === 0 || !redditUsername) {
      return;
    } else {
      await handleFetchMatches(matchQuery);
      router.push("/match");
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-x-hidden font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="container mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12">
        {/* Left: Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
            Meet <span className="text-red-500">Your Next Match</span> Instantly
          </h1>
          <p className="text-lg lg:text-xl mb-8 text-gray-300 max-w-xl">
            Plug in your Reddit persona, chat with Sparky, and get paired with
            the roommate, professor, or friend who aligns with you best.
          </p>
        </motion.div>

        {/* Right: Demo Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          {/* Connect Reddit */}
          <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800 rounded-3xl shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FaReddit className="w-6 h-6 text-white" />{" "}
                <span className="text-white">
                  {redditUsername
                    ? `Linked ${redditUsername}`
                    : "Connect Reddit"}
                </span>
              </CardTitle>
              <CardDescription>
                {redditUsername
                  ? "Talk to Sparky next!"
                  : "Import your interests & vibes"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setConsentDialogOpen(true)}
                disabled={redditUsername ? true : false}
                className="bg-red-500 mt-4 w-full rounded-xl"
              >
                {redditUsername ? "You're Linked!" : "Link Reddit"}
              </Button>
            </CardContent>
          </Card>

          {/* Consent Dialog */}
          <ConsentDialog
            open={consentDialogOpen}
            setOpen={setConsentDialogOpen}
          />

          {/* Chat with AI */}
          <Card className="bg-gray-900/60 backdrop-blur-lg border-gray-800 rounded-3xl shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FaFireFlameCurved className="w-6 h-6 text-white" />{" "}
                <span className="text-white">Sparky</span>
              </CardTitle>
              <CardDescription>
                Tell me what you&#39;re looking for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="What do you want to find?"
                className="rounded-xl bg-gray-800 mt-4 text-white"
                onChange={(e) => dispatch(setQuery(e.target.value))}
                value={matchQuery}
              />
            </CardContent>
          </Card>

          <Button className="bg-red-500" onClick={handleFindMatches}>
            Find me my people!
          </Button>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
