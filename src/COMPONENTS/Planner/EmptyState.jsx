// ============================================
// EMPTY STATE COMPONENT
// ============================================
import React from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function EmptyState({ onSetupClick }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-indigo-500" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-100 mb-4">
          Let's set up your study plan
        </h2>

        <p className="text-neutral-400 text-lg mb-2 max-w-md">
          Set once. We'll handle the rest.
        </p>
        <p className="text-neutral-500 text-base max-w-md mb-8">
          Tell us about your study goals, preferred time, and subjects you want to focus on.
        </p>

        <button
          onClick={onSetupClick}
          className="inline-flex items-center gap-2 bg-neutral-100 hover:bg-white text-neutral-950 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 group"
        >
          Start Setup
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-neutral-600 text-sm mt-6">
          Takes less than 2 minutes
        </p>
      </div>
    </div>
  );
}