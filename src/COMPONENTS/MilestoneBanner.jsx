// src/COMPONENTS/MilestoneBanner.jsx - ONLY 500 STUDENTS

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMilestoneStats } from '../REDUX/Slices/adminSlice';
import confetti from 'canvas-confetti';

const MilestoneBanner = () => {
  const dispatch = useDispatch();
  const { milestoneStats } = useSelector(state => state.admin);
  const [milestone, setMilestone] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // ✅ ONLY 500 STUDENTS milestone
  const MILESTONE_500_USERS = {
    key: 'users_500',
    threshold: 500,
    type: 'users',
    emoji: '🚀',
    message: '500 Students!',
    color: 'from-purple-500 via-pink-500 to-rose-500',
  };

  useEffect(() => {
    console.log('🎯 MilestoneBanner: Fetching stats');
    dispatch(getMilestoneStats());
  }, [dispatch]);

  useEffect(() => {
    console.log('📊 Current Stats:', milestoneStats);
  }, [milestoneStats]);

  useEffect(() => {
    if (!milestoneStats || !milestoneStats.totalUsers) {
      console.warn('⚠️ No valid milestone stats');
      return;
    }

    console.log('🔍 Checking 500 users milestone...');
    const currentUsers = milestoneStats.totalUsers;
    console.log(`Users: ${currentUsers} >= ${MILESTONE_500_USERS.threshold}?`);

    // ✅ Only show if:
    // 1. Users >= 500
    // 2. Not already shown
    if (currentUsers >= MILESTONE_500_USERS.threshold) {
      const wasShown = localStorage.getItem(`milestone_${MILESTONE_500_USERS.key}`);

      if (!wasShown) {
        console.log(`✅ SHOWING: ${MILESTONE_500_USERS.message}`);
        setMilestone(MILESTONE_500_USERS);
        setIsVisible(true);
        localStorage.setItem(`milestone_${MILESTONE_500_USERS.key}`, 'true');
        triggerConfetti();
      } else {
        console.log('✅ Milestone already shown');
      }
    } else {
      console.log(`⏭️ Only ${currentUsers} users, need 500`);
    }
  }, [milestoneStats]);

  const triggerConfetti = () => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 10000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 40 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => setIsDismissed(true), 300);
  };

  const handleShare = () => {
    const message = `🎉 ${milestone.emoji} ${milestone.message}\n\nJoin AcademicArk - Ultimate AKTU exam prep! 📚\n\n🔗 ${window.location.origin}`;

    if (navigator.share) {
      navigator.share({ title: 'AcademicArk Milestone!', text: message });
    } else {
      navigator.clipboard.writeText(message);
      alert('✅ Link copied! Share with friends 📋');
    }
  };

  if (!milestone || isDismissed) return null;

  return (
    <>
      <div className={`fixed top-24 right-4 left-4 sm:left-auto sm:right-6 sm:max-w-md z-[9999] transition-all duration-500 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-96 opacity-0 pointer-events-none'
      }`}>
        <div className={`absolute -inset-1 bg-gradient-to-r ${milestone.color} rounded-2xl blur-lg opacity-50 animate-pulse`} />

        <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <button 
            onClick={handleDismiss}
            className="absolute top-3 right-3 z-20 p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{milestone.emoji}</div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${milestone.color} bg-clip-text text-transparent truncate`}>
                  {milestone.message}
                </h3>
                <p className="text-sm text-gray-400">Thanks for your support! 🙏</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className={`flex-1 px-4 py-2 bg-gradient-to-r ${milestone.color} hover:opacity-90 text-white text-sm font-semibold rounded-lg transition-all`}
              >
                Awesome! 🎉
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-all border border-white/20"
                title="Share"
              >
                📤
              </button>
            </div>
          </div>

          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${milestone.color} opacity-20 blur-2xl rounded-full`} />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default MilestoneBanner;