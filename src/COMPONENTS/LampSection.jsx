import React from "react";
import { motion } from "motion/react";
import { LampContainer } from "./ui/lamp";

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
          <button className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300">
            Start Learning
          </button>
          <button className="px-8 py-3 border border-gray-600 text-white rounded-lg font-semibold hover:border-gray-400 transition-all duration-300">
            Explore Materials
          </button>
        </div>
      </motion.div>
    </LampContainer>
  );
}
