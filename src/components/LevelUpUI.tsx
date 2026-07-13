
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store/gameStore';
import confetti from 'canvas-confetti';

export const LevelUpUI: React.FC = () => {
  const popups = useGameStore(state => state.levelUpPopups);
  const data = popups.length > 0 ? popups[popups.length - 1] : null;

  useEffect(() => {
    if (data) {
      // Trigger confetti when level up appears
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#B1B2FF']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#B1B2FF']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [data]);

  return (
    <AnimatePresence>
      {data && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[2000]">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2, y: -100 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="flex flex-col items-center"
          >
            {/* Top Badge */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-[#1A1A1A]/90 text-[#FFD700] text-sm md:text-base font-bold px-6 py-2 rounded-full border border-[#FFD700]/30 shadow-lg mb-4 tracking-widest uppercase flex items-center gap-2 backdrop-blur-sm"
            >
              <span>🏆</span> ACHIEVEMENT UNLOCKED
            </motion.div>

            {/* Title */}
            <motion.div
              animate={{
                textShadow: [
                  '0 4px 4px rgba(0,0,0,0.5)',
                  '0 4px 15px rgba(255,107,107,0.5)',
                  '0 4px 4px rgba(0,0,0,0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl md:text-[7rem] font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF75C3] via-[#FFA647] to-[#FFE83F] italic leading-tight"
            >
              Level Up!
            </motion.div>
            
            {/* Main Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 relative p-[3px] rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-500 shadow-[0_0_30px_rgba(236,72,153,0.3)]"
            >
              <div className="bg-[#111] rounded-[14px] px-16 py-6 flex flex-col items-center justify-center min-w-[280px]">
                <div className="text-pink-400 font-bold tracking-widest text-sm mb-3 uppercase flex items-center gap-2">
                  ✨ {data.skill === 'Level' ? 'SUMMER LAB' : data.skill}
                </div>
                <div className="flex items-end gap-3 text-white font-mono font-bold text-4xl">
                  Lvl <span className="text-yellow-400 text-6xl md:text-7xl leading-none">{data.level}</span>
                </div>
              </div>
            </motion.div>

            {/* Bottom Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 bg-[#1A1A1A]/90 text-[#FFD700] text-sm md:text-base font-bold px-6 py-2 rounded-full border border-[#FFD700]/30 shadow-lg tracking-widest uppercase flex items-center gap-2 backdrop-blur-sm"
            >
              <span>✨</span> NEW CHECKPOINT CLAIMED!
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
