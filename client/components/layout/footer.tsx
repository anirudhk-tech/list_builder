"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { setDeleteDataDialogState } from "@/store/slices/dialogSlice";

export const Footer: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <footer className="bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-gray-400 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:justify-between gap-6">
        {/* Left: Social & Support */}
        {/* <div className="flex space-x-4">
          <motion.a
            href="https://twitter.com/FlamesAI"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaTwitter className="w-5 h-5 hover:text-white" />
          </motion.a>
          <motion.a
            href="https://github.com/FlamesAI"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaGithub className="w-5 h-5 hover:text-white" />
          </motion.a>
          <motion.a
            href="https://discord.com/invite/flamesai"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaDiscord className="w-5 h-5 hover:text-white" />
          </motion.a>
        </div> */}

        {/* Center: Brand & Legal */}
        <div className="text-center text-sm">
          <span>
            © {new Date().getFullYear()} FlamesAI. All rights reserved.
          </span>
        </div>

        {/* Right: Links & Back to Top */}
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
          <motion.span
            className="cursor-pointer underline"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => router.push("/terms")}
          >
            Terms & Conditions
          </motion.span>
          <motion.span
            className="cursor-pointer underline"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => router.push("/privacy")}
          >
            Privacy Policy
          </motion.span>
          <motion.span
            className="cursor-pointer underline"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => dispatch(setDeleteDataDialogState(true))}
          >
            Delete My Data
          </motion.span>
        </div>
      </div>
    </footer>
  );
};
