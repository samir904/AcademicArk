import React from "react";
import { motion } from "motion/react";
import { LampContainer } from "./ui/lamp";

export function WhyChooseAcademicArkLamp() {
  const reasons = [
    {
      icon: "📚",
      title: "Comprehensive Materials",
      description: "AKTU-aligned notes for all subjects covering every unit and topic"
    },
    {
      icon: "⭐",
      title: "Important Questions",
      description: "Curated high-probability questions that frequently appear in AKTU exams"
    },
    {
      icon: "📄",
      title: "Previous Year Papers",
      description: "Complete collection of AKTU PYQ papers organized by year and subject"
    },
    {
      icon: "🎯",
      title: "Exam-Focused Content",
      description: "Every resource is designed specifically for AKTU B.Tech examination success"
    },
    {
      icon: "🆓",
      title: "100% Free Forever",
      description: "No hidden charges, no premium plans - all content is completely free"
    },
    {
      icon: "⚡",
      title: "Regularly Updated",
      description: "Latest syllabus updates and new materials added every week"
    }
  ];

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
        className="text-center px-4 relative z-50 w-full"
      >
        <h1 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-6xl">
          Why Choose
          <br />
          <span className="text-blue-400">AcademicArk?</span>
        </h1>

        <p className="mt-6 text-gray-300 max-w-3xl mx-auto text-lg mb-16">
          Everything you need to ace your AKTU exams, all in one platform
        </p>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1 * index,
                duration: 0.6,
                ease: "easeInOut",
              }}
              className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-blue-400/30 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {reason.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {reason.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-12">
          Trusted by 100+ AKTU B.Tech students • Updated for 2025-26 syllabus
        </p>
      </motion.div>
    </LampContainer>
  );
}
