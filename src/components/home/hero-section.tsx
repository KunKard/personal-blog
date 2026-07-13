"use client";

import { motion } from "framer-motion";
import { TypewriterText } from "@/components/home/typewriter-text";
import { HomeMenu } from "@/components/home/home-menu";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-foreground/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-foreground/5 rounded-full blur-3xl" />

      {/* Avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="w-32 h-32 mx-auto rounded-full border-2 border-border bg-surface flex items-center justify-center text-5xl">
          🎮
        </div>
      </motion.div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-4xl sm:text-6xl font-bold mb-4 tracking-tight"
      >
        <TypewriterText text="Kworld" delay={60} />
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-lg sm:text-xl text-muted max-w-lg mb-8"
      >
        Code. Create. Play.
      </motion.p>

      {/* Tag badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="flex flex-wrap gap-2 justify-center mb-12"
      >
        {["Unity", "UE", "C++", "C#", "GameDesign"].map((tag, i) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs rounded-full border border-border bg-surface text-muted"
          >
            {tag}
          </span>
        ))}
      </motion.div>

      {/* Menu buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <HomeMenu />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-muted rounded-full flex items-start justify-center p-1"
        >
          <div className="w-1.5 h-1.5 bg-muted rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
