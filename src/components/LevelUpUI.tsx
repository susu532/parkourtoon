import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGameStore } from "../store/gameStore";
import { Sparkles, Trophy, Star } from "lucide-react";
import { audioManager } from "../game/AudioManager";
import { CrazyGamesManager } from "../game/CrazyGamesManager";
import confetti from "canvas-confetti";

export const LevelUpUI: React.FC = () => {
  const popups = useGameStore((state) => state.levelUpPopups);
  const [currentPopup, setCurrentPopup] = React.useState<{ id: number; skill: string; level: number } | null>(null);

  // Queue-based level up viewer to prevent conflicts and guarantee full display
  React.useEffect(() => {
    if (popups.length > 0 && !currentPopup) {
      const nextPopup = popups[0];
      setCurrentPopup(nextPopup);
      
      // Play level-up celebration sound and trigger Confetti
      try {
        audioManager.play("level_up", 0.7, 1.0);
      } catch (e) {
        console.warn("Could not play level_up audio:", e);
      }

      try {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#55FFFF", "#FF55FF", "#FFFF55", "#55FF55"],
          zIndex: 99999,
        });
      } catch (e) {
        console.warn("Could not fire confetti:", e);
      }

      try {
        CrazyGamesManager.happytime();
      } catch (e) {
        console.warn("Could not play happytime:", e);
      }
    }
  }, [popups, currentPopup]);

  // Handle timeout independently so it's not canceled by re-renders
  React.useEffect(() => {
    if (currentPopup) {
      const t = setTimeout(() => {
        useGameStore.getState().removeLevelUpPopup(currentPopup.id);
        setCurrentPopup(null);
      }, 4000);

      return () => clearTimeout(t);
    }
  }, [currentPopup]);

  // Letters of the Level Up banner for gorgeous staggered spring entry
  const firstWord = "LEVEL".split("");
  const secondWord = "UP!".split("");

  // Letter Motion Containers
  const letterContainerVariant = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariant = {
    initial: { y: 40, opacity: 0, scale: 0.5, rotate: -10 },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    },
  };

  return (
    <AnimatePresence>
      {currentPopup && (
        <motion.div
          key={currentPopup.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-[10000] overflow-hidden"
        >
          {/* Reduced burst of rotating stars for mobile performance */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            {[...Array(6)].map((_, i) => {
              const angle = (i / 6) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
              const distance = 80 + Math.random() * 100;
              const randomDuration = 1.0 + Math.random() * 0.5;
              const size = Math.random() * 8 + 12;
              const colors = [
                "text-yellow-400",
                "text-pink-400",
                "text-purple-400",
                "text-amber-300",
              ];
              const randomColor = colors[i % colors.length];

              return (
                <motion.div
                  key={`spk-${i}`}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [1, 1, 0],
                    scale: [0, 1.2, 0.8],
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                  }}
                  transition={{
                    duration: randomDuration,
                    ease: "easeOut",
                  }}
                  className="absolute"
                >
                  <Star
                    className={`${randomColor}`}
                    style={{ width: size, height: size }}
                    fill="currentColor"
                  />
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, y: -40 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center relative z-20"
          >
            {/* Optimized Glow instead of heavy blur */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-[280px] md:h-[280px] rounded-full bg-pink-500/10 blur-xl md:blur-2xl -z-10"
            />

            {/* Achievement Unlocked Header Pin */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="flex items-center gap-2 mb-3 bg-zinc-950/80 border border-amber-400/40 px-4 py-1.5 rounded-full shadow-lg"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-amber-200 text-xs tracking-widest font-extrabold font-mono uppercase">
                ACHIEVEMENT UNLOCKED
              </span>
            </motion.div>

            {/* Staggered Spring Letters for "LEVEL UP!" */}
            <motion.div
              variants={letterContainerVariant}
              initial="initial"
              animate="animate"
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 select-none"
            >
              <div className="flex gap-1 md:gap-2">
                {firstWord.map((letter, i) => (
                  <motion.span
                    key={`l-${i}`}
                    variants={letterVariant}
                    className="text-4xl sm:text-6xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-200 to-pink-500"
                    style={{ textShadow: "0 2px 4px rgba(236,72,153,0.3)" }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
              <div className="flex gap-1 md:gap-2">
                {secondWord.map((letter, i) => (
                  <motion.span
                    key={`u-${i}`}
                    variants={letterVariant}
                    className="text-4xl sm:text-6xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-500"
                    style={{ textShadow: "0 2px 4px rgba(245,158,11,0.3)" }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Premium Gold & Pink Level Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.4, duration: 0.6 }}
              className="mt-6 bg-gradient-to-r from-pink-500 via-amber-500 to-purple-600 p-[2px] rounded-xl shadow-xl max-w-[90%]"
            >
              <div className="bg-zinc-950/95 rounded-[10px] px-8 sm:px-12 py-5 flex flex-col items-center border border-white/10 min-w-[240px] max-w-sm">
                <span className="text-pink-300 text-xs font-black uppercase tracking-widest mb-1 shadow-sm flex items-center justify-center gap-1.5 flex-wrap text-center w-full">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>{currentPopup.skill}</span>
                </span>
                
                <div className="flex items-center gap-2.5">
                  <span className="text-zinc-400 text-lg font-bold tracking-widest font-mono">Lvl</span>
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 text-4xl sm:text-5xl font-black tracking-tight"
                  >
                    {currentPopup.level}
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Checkpoint / Reward Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 flex items-center gap-1.5 text-amber-200 font-bold text-[10px] tracking-widest bg-amber-950/80 px-4 py-2 rounded-full border border-amber-500/30 uppercase"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              New checkpoint claimed!
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

