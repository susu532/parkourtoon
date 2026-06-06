import React from "react";
import { useUIStore } from "../store/uiStore";
import { motion, AnimatePresence } from "motion/react";

export const TutorialUI: React.FC = () => {
  const showTutorialPopup = useUIStore((state) => state.showTutorialPopup);
  const isLaunchMenuOpen = useUIStore((state) => state.isLaunchMenuOpen);
  const setShowTutorialPopup = useUIStore((state) => state.setShowTutorialPopup);

  const handleClose = () => {
    setShowTutorialPopup(false);
  };

  return (
    <AnimatePresence>
      {showTutorialPopup && !isLaunchMenuOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 pointer-events-none"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="relative w-full max-w-3xl bg-[var(--ui-bg)] border-2 border-[var(--ui-border)] p-4 rounded shadow-xl flex flex-col gap-4 text-[var(--ui-text)]"
          >
            <div className="w-full rounded overflow-hidden shadow border border-black/20 bg-zinc-950/40">
              <img src="https://raw.githubusercontent.com/susu532/sounds/main/minecraft/1.png" alt="Parkour Toon Tutorial" className="w-full h-auto object-contain max-h-[70vh] mx-auto" />
            </div>

            <button
              onClick={handleClose}
              className="py-3 bg-[var(--ui-primary)] hover:bg-[var(--ui-primary-hover)] active:bg-[var(--ui-primary-active)] text-white font-bold rounded shadow-sm hover:shadow-md transition-all uppercase tracking-wide text-md border border-black/20 w-full"
            >
              Start Playing
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
