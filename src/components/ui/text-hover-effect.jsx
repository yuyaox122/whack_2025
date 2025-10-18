"use client";
import React from "react";
import { motion } from "framer-motion";

export const TextHoverEffect = ({ text, duration = 0.3 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative inline-block"
    >
      <motion.span
        className="relative z-10"
        whileHover={{
          backgroundPosition: "200% center",
        }}
        transition={{ duration }}
        style={{
          background: "linear-gradient(90deg, #10b981, #34d399, #10b981)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration }}
        style={{
          background: "linear-gradient(90deg, #10b981, #34d399, #10b981)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "blur(60px)",
        }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0 opacity-0"
        whileHover={{ opacity: 0.6 }}
        transition={{ duration }}
        style={{
          background: "linear-gradient(90deg, #10b981, #34d399, #10b981)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "blur(80px)",
        }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
};
