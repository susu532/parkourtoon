import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGameStore } from "../store/gameStore";
import { Sparkles, Trophy, Star } from "lucide-react";
import { audioManager } from "../game/AudioManager";

export const LevelUpUI: React.FC = () => {
  const popups = useGameStore((state) => state.levelUpPopups);
  const [currentPopup, setCurrentPopup] = React.useState<{ id: number; skill: string; level: number } | null>(null);

  // Queue-based level up viewer to prevent conflicts and guarantee full display
  React.useEffect(() => {
    if (popups.length > 0 && !currentPopup) {
      const nextPopup = popups[0];
      setCurrentPopup(nextPopup);
      
      // Play level-up celebration sound
      try {
        audioManager.play("level_up", 0.7, 1.0);
      } catch (e) {
        console.warn("Could not play level_up audio:", e);
      }
    }
  }, [popups, currentPopup]);

  // Handle timeout independently so it's not canceled by re-renders
  React.useEffect(() => {
    if (currentPopup) {
      const t = setTimeout(() => {
        useGameStore.getState().removeLevelUpPopup(currentPopup.id);
        setCurrentPopup(null);
      }, 4500);

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
    initial: { y: 60, opacity: 0, scale: 0.3, rotate: -20 },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 12,
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
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-[10000] overflow-hidden"
        >
          {/* Intense burst of rotating stars and sparks */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            {[...Array(32)].map((_, i) => {
              const angle = (i / 32) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
              const distance = 120 + Math.random() * 220;
              const randomDuration = 1.2 + Math.random() * 0.8;
              const size = Math.random() * 12 + 16;
              const colors = [
                "text-yellow-400",
                "text-pink-400",
                "text-purple-400",
                "text-cyan-400",
                "text-amber-300",
                "text-emerald-400",
              ];
              const randomColor = colors[i % colors.length];

              return (
                <motion.div
                  key={`spk-${i}`}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
                  animate={{
                    opacity: [1, 1, 0],
                    scale: [0, 1.4, 0.8],
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    rotate: Math.random() * 360 + 180,
                  }}
                  transition={{
                    duration: randomDuration,
                    ease: "easeOut",
                  }}
                  className="absolute"
                >
                  <Star
                    className={`${randomColor} drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]`}
                    style={{ width: size, height: size }}
                    fill="currentColor"
                  />
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, blur: "10px", y: -60 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center relative z-20"
          >
            {/* Hypnotic Glowing Sunburst Halo */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-[480px] md:h-[480px] rounded-full bg-gradient-to-tr from-pink-600/40 via-purple-600/30 to-amber-500/20 blur-3xl -z-10"
            />
            
            {/* Centered spinning ray lines */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 -z-20 opacity-30 pointer-events-none select-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`ray-${i}`}
                  style={{ rotate: `${i * 45}deg` }}
                  animate={{ scale: [1, 1.15, 1], rotate: `${i * 45 + 360}deg` }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-1 md:w-1.5 h-full bg-gradient-to-t from-transparent via-pink-400 to-transparent" />
                </motion.div>
              ))}
            </div>

            {/* Achievement Unlocked Header Pin */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="flex items-center gap-2 mb-4 bg-zinc-950/80 border border-amber-400/40 px-5 py-2 rounded-full backdrop-blur-md shadow-[0_4px_20px_rgba(245,158,11,0.25)]"
            >
              <Trophy className="w-4.5 h-4.5 text-amber-400 animate-bounce" />
              <span className="text-amber-200 text-xs tracking-[0.2em] font-extrabold font-mono uppercase">
                ACHIEVEMENT UNLOCKED
              </span>
            </motion.div>

            {/* Staggered Spring Letters for "LEVEL UP!" */}
            <motion.div
              variants={letterContainerVariant}
              initial="initial"
              animate="animate"
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 select-none"
            >
              <div className="flex gap-2 md:gap-3">
                {firstWord.map((letter, i) => (
                  <motion.span
                    key={`l-${i}`}
                    variants={letterVariant}
                    className="text-5xl sm:text-7xl md:text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-200 to-pink-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
                    style={{ textShadow: "0 0 10px rgba(236, 72, 153, 0.4)", padding: "0.05em" }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
              <div className="flex gap-2 md:gap-3">
                {secondWord.map((letter, i) => (
                  <motion.span
                    key={`u-${i}`}
                    variants={letterVariant}
                    className="text-5xl sm:text-7xl md:text-8xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
                    style={{ textShadow: "0 0 10px rgba(245, 158, 11, 0.4)", padding: "0.05em" }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Premium Gold & Pink Level Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", bounce: 0.45, duration: 0.7 }}
              className="mt-8 bg-gradient-to-r from-pink-500 via-amber-500 to-purple-600 p-[2.5px] rounded-2xl shadow-[0_12px_40px_rgba(236,72,153,0.35)] max-w-full"
            >
              <div className="bg-zinc-950/95 backdrop-blur-3xl rounded-[14px] px-12 sm:px-16 py-6 sm:py-8 flex flex-col items-center border border-white/10 min-w-[280px] sm:min-w-[340px] max-w-md shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <span className="text-pink-300 text-xs sm:text-sm font-black uppercase tracking-[0.18em] mb-2 px-1 flex items-center justify-center gap-2 flex-wrap text-center w-full break-words">
                  <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>{currentPopup.skill}</span>
                </span>
                
                <div className="flex items-center gap-3.5">
                  <span className="text-zinc-400 text-xl font-bold tracking-widest font-mono">Lvl</span>
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.65, type: "spring" }}
                    className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 text-5xl sm:text-6xl font-black tracking-tight"
                  >
                    {currentPopup.level}
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Checkpoint / Reward Text */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="mt-6 flex items-center gap-2 text-amber-200 font-extrabold text-xs tracking-[0.15em] bg-amber-950/50 px-6 py-2.5 rounded-full border border-amber-500/30 backdrop-blur-sm shadow-[0_2px_10px_rgba(245,158,11,0.15)] uppercase"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              New checkpoint claimed!
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
