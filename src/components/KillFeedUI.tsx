import React from "react";
import { useGameStore } from "../store/gameStore";
import { motion, AnimatePresence } from "motion/react";
import { Skull } from "lucide-react";

export const KillFeedUI: React.FC = () => {
  const killFeedMessages = useGameStore((state) => state.killFeedMessages);

  return (
    <div className="absolute top-20 right-4 z-[60] flex flex-col items-end gap-2 pointer-events-none w-max">
      <AnimatePresence>
        {killFeedMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-500/90 to-pink-500/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md text-white border border-rose-400/30"
          >
            <Skull className="w-4 h-4 opacity-90 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide drop-shadow-sm">
              {msg.message}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
