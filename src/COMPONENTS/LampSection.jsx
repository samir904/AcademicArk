import React from "react";
import { motion } from "motion/react";
import { LampContainer } from "./ui/lamp";
import { MovingBorderButton } from "./MovingBorderButton";

export function LampSection() {
  return (
    <LampContainer>
      <motion.div
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="text-center"
      >
        <h1 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
          Master AKTU Exams
          <br />
          <span className="text-blue-400">the Smart Way</span>
        </h1>
        
        <p className="mt-6 text-gray-300 max-w-2xl mx-auto text-lg">
          Comprehensive AKTU study materials, previous year papers, and important questions
          all in one place. Prepare like never before.
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <MovingBorderButton/>
        </div>
      </motion.div>
    </LampContainer>
  );
}
