import { motion } from "framer-motion";

export const FireBackdrop = () => {
  const loop = {
    repeat: Infinity,
    repeatType: "loop" as "loop" | "reverse",
    ease: "easeInOut",
  };

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {/* ember layer (deep red/orange) */}
      <motion.div
        className="absolute rounded-full blur-[90px]"
        style={{
          width: 240,
          height: 240,
          background: `radial-gradient(
                        circle at 50% 60%,
                        rgba(255, 140, 0, 0.9) 0%,
                        rgba(255, 80, 0, 0.75) 30%,
                        rgba(200, 30, 0, 0.6) 60%,
                        rgba(100, 0, 0, 0.4) 85%,
                        transparent 100%
                    )`,
        }}
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.25, 0.9, 1.3, 1],
          x: [0, -4, 2, -1, 0],
          y: [0, -6, 3, -2, 0],
          opacity: [0.25, 0.4, 0.3, 0.5, 0.25],
        }}
        transition={{ duration: 4, ...loop }}
      />

      {/* mid flame (orange/yellow) */}
      <motion.div
        className="absolute rounded-full blur-[80px]"
        style={{
          width: 180,
          height: 180,
          background:
            "radial-gradient(circle at 50% 40%, rgba(255,180,0,0.45) 0%, rgba(255,90,0,0.05) 75%)",
        }}
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.4, 0.95, 1.35, 1],
          x: [0, 3, -2, 1, 0],
          y: [0, -5, 2, -1, 0],
          opacity: [0.3, 0.55, 0.4, 0.6, 0.3],
        }}
        transition={{ duration: 2.8, ...loop }}
      />

      {/* hottest core (white/yellow) */}
      <motion.div
        className="absolute rounded-full blur-[70px]"
        style={{
          width: 120,
          height: 120,
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,240,200,0.6) 0%, rgba(255,150,0,0.05) 80%)",
        }}
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.5, 0.8, 1.4, 1],
          x: [0, -2, 1, -1, 0],
          y: [0, -4, 3, -2, 0],
          opacity: [0.4, 0.8, 0.5, 1, 0.4],
        }}
        transition={{ duration: 2.2, ...loop }}
      />
    </div>
  );
};
