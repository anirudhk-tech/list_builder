import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FireBackdrop } from "./flickering-fire";
import { TypeText } from "@/components/ui/type-text";
import { motion } from "framer-motion";
import { FaBolt, FaReddit } from "react-icons/fa";
import { MainState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRedditMatch } from "@/hooks/reddit/user/useRedditMatch";
import { toast } from "sonner";
import { ConsentDialog } from "./consent-dialog";
import { Input } from "@/components/ui/input";
import { setQuery } from "@/store/slices/matchSlice";

export const HeroSection: React.FC = () => {
  const redditUsername = useSelector(
    (state: MainState) => state.user.redditUsername
  );
  const [consentDialogOpen, setConsentDialogOpen] = useState(false);
  const [redditLinking, setRedditLinking] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const matchQuery = useSelector((state: MainState) => state.match.query);

  const { handleFetchMatches, loading } = useRedditMatch();

  const handleFindMatches = async () => {
    if (!redditUsername) {
      toast.error("Please link your Reddit account", {
        description: "It'll help us find you the perfect connection.",
      });
    } else if (matchQuery.trim().length === 0) {
      toast.error("Please enter a query", {
        description: "We need to know what you're looking for!",
      });
    } else {
      await handleFetchMatches(matchQuery);
      router.push("/match");
    }
  };

  useEffect(() => {
    const redditConnectLoading = localStorage.getItem("redditConnectLoading");
    if (redditConnectLoading) {
      setRedditLinking(true);
      localStorage.removeItem("redditConnectLoading");
    }
  }, []);

  useEffect(() => {
    if (redditUsername) {
      setRedditLinking(false);
    }
  }, [redditUsername]);

  return (
    <>
      <FireBackdrop />

      {/* HERO SECTION */}
      <section className="flex-grow container mx-auto px-6 pt-24 grid lg:grid-cols-2 gap-12">
        {/* Left: Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
            Your <span className="text-red-500">Next Connection</span> Awaits
          </h1>
          <div className="h-40 sm:h-60 lg:h-90">
            <TypeText
              textsToType={[
                "I need a roommate for fall semester",
                "I need a study buddy for my summer math class",
                "I need a friend to explore campus over break",
                "I need someone to split an IKEA run on move-in day",
                "I need a gym partner for early-morning workouts",
                "I need fellow anime fans for weekend marathons",
                "I need help figuring out my freshman schedule",
                "I need a teammate for intramural soccer",
                "I need someone to practice coding interviews with",
                "I need a late-night ramen buddy",
              ]}
              forwardSpeed={35}
              backwardSpeed={25}
              pause={2000}
            />
          </div>
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
                disabled={redditLinking || !!redditUsername}
                className="bg-red-500 mt-4 w-full rounded-xl relative overflow-hidden"
              >
                {redditLinking
                  ? "Linking..."
                  : redditUsername
                  ? "You're Linked!"
                  : "Link Reddit"}
                {redditLinking && (
                  <span className="shimmer" aria-hidden="true"></span>
                )}
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
                <FaBolt className="w-6 h-6 text-white" />{" "}
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

          <Button
            disabled={loading}
            className="relative bg-red-500 rounded-xl overflow-hidden"
            onClick={handleFindMatches}
          >
            {loading ? "Finding Matches..." : "Find Matches"}
            {loading && <span className="shimmer" aria-hidden="true" />}
          </Button>
        </motion.div>
      </section>
    </>
  );
};
