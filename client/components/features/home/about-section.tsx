"use client";

import { motion } from "framer-motion";
import { FaBrain, FaUserFriends, FaLock, FaBolt } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const AboutSection: React.FC = () => {
  const features = [
    {
      icon: <FaBrain className="w-6 h-6 text-red-500" />,
      title: "Machine-Learning Magic",
      desc: "We crunch your Reddit vibes with FlamesAI to surface eerily perfect matches.",
    },
    {
      icon: <FaUserFriends className="w-6 h-6 text-red-500" />,
      title: "Human-First Design",
      desc: "FlamesAI is built for genuine connections. Roommates, study buddies, co-founders. Not swipe fatigue.",
    },
    {
      icon: <FaLock className="w-6 h-6 text-red-500" />,
      title: "Privacy on 🔒-mode",
      desc: "OAuth-only access, encryption everywhere, and a one-click data wipe. Your Reddit past stays yours.",
    },
    {
      icon: <FaBolt className="w-6 h-6 text-red-500" />,
      title: "Sparky, Your AI Wingman",
      desc: "Our chat assistant explains why two people click, breaks ice with prompts, and keeps things fun.",
    },
  ];

  return (
    <section
      id="about"
      className="relative z-10 container mx-auto px-6 pb-24 grid gap-12 lg:grid-cols-2 mt-20"
    >
      {/* Left: headline & copy */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col justify-center"
      >
        <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
          What <span className="text-red-500">Makes FlamesAI</span> Different?
        </h2>
        <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-xl">
          We combine Reddit’s endless personality breadcrumbs with bleeding-edge
          AI to connect people fast. No endless swiping, no creepy data resale,
          just pinpoint matches and friction-free intros.
        </p>
      </motion.div>

      {/* Right: feature cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="grid sm:grid-cols-2 gap-6"
      >
        {features.map(({ icon, title, desc }) => (
          <Card
            key={title}
            className="bg-gray-900/60 backdrop-blur-lg border-gray-800 rounded-3xl shadow-2xl h-full"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              {icon}
              <CardTitle className="text-white text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </section>
  );
};
