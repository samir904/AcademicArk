import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Zap, Users } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-black via-[#0F0F0F] to-black min-h-[280px] md:min-h-[360px]">
      {/* Subtle Animated Background - Calm gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-slate-600/3 rounded-full blur-3xl"></div>
      </div>

      {/* Minimal Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Top Section - Label */}
        <div className="mb-8 md:mb-12">
          <p className="text-[#6B7280] text-xs font-medium uppercase tracking-widest">
            Your Study Companion
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6 md:space-y-8">
            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white leading-tight">
                AKTU Study
                <span className="block text-[#9CA3AF]">Hub</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base md:text-lg text-[#9CA3AF] leading-relaxed max-w-xl">
                Access comprehensive study materials including notes, previous year questions, important questions, handwritten notes, and video lectures - all organized by semester.
              </p>
            </div>

            {/* Features List - Calm Style */}
            <div className="space-y-3 pt-4">
              {[
                { icon: BookOpen, label: 'Study Notes', desc: 'Organized notes for all subjects' },
                { icon: Zap, label: 'Quick Access', desc: 'Find what you need instantly' },
                { icon: Users, label: 'Community', desc: 'Learn from peer resources' }
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <Icon className="w-4 h-4 text-[#6B7280]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{feature.label}</p>
                      <p className="text-xs text-[#6B7280]">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                onClick={() => {
                  const semesterSection = document.querySelector('[data-semester-section]');
                  if (semesterSection) {
                    semesterSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center gap-2 bg-[#9CA3AF] hover:bg-white text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <span>Start Browsing</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Stats/Cards Section */}
          <div className="space-y-4 md:space-y-6">
            {/* Stats Cards - Calm Style */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: '1000+', label: 'Study Materials', color: 'from-blue-600/10 to-blue-700/5', border: 'border-blue-600/20' },
                { number: '8', label: 'Semesters', color: 'from-purple-600/10 to-purple-700/5', border: 'border-purple-600/20' },
                { number: '5000+', label: 'Active Students', color: 'from-slate-600/10 to-slate-700/5', border: 'border-slate-600/20' },
                { number: '24/7', label: 'Access', color: 'from-emerald-600/10 to-emerald-700/5', border: 'border-emerald-600/20' }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-xl p-4 text-center transition-all duration-300 hover:border-opacity-50`}
                >
                  <p className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.number}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Highlight Box */}
            <div className="bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-5 space-y-3">
              <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                Features
              </p>
              <div className="space-y-2">
                {[
                  '📚 Semester-wise organization',
                  '📄 Previous year papers',
                  '✏️ Handwritten notes',
                  '🎬 Video lectures'
                ].map((feature, idx) => (
                  <p key={idx} className="text-sm text-[#9CA3AF]">
                    {feature}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Call to action hint */}
        <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-[#1F1F1F]">
          <p className="text-sm text-[#6B7280] text-center">
            Select your semester below to get started with your studies →
          </p>
        </div>
      </div>
    </div>
  );
}