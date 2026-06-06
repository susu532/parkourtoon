import React from "react";
import { useUIStore } from "../store/uiStore";
import { motion, AnimatePresence } from "motion/react";
import { X, Keyboard, MousePointerClick, Gem, Sword, Mountain } from "lucide-react";

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
            className="relative w-full max-w-md bg-[var(--ui-bg)] border-2 border-[var(--ui-border)] p-6 rounded shadow-xl flex flex-col gap-4 text-[var(--ui-text)]"
          >
            <div className="absolute top-2 right-2">
              <button
                onClick={handleClose}
                className="text-[var(--ui-text-dim)] hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white text-shadow-sm">Welcome to Miniverse!</h2>
              <p className="text-sm text-[var(--ui-text-dim)]">Here's a quick guide to help you get started.</p>
            </div>

            <div className="flex flex-col gap-3 py-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500/20 rounded flex-shrink-0">
                  <Keyboard className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-md sm:text-lg font-bold text-white mb-0.5">Controls</h3>
                  <p className="text-sm text-[var(--ui-text-dim)] leading-tight">Use <b>WASD</b> to move, <b>Space</b> to jump, and <b>E</b> to open your inventory. Scroll your mouse wheel to switch items.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-500/20 rounded flex-shrink-0">
                  <MousePointerClick className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-md sm:text-lg font-bold text-white mb-0.5">Interaction</h3>
                  <p className="text-sm text-[var(--ui-text-dim)] leading-tight"><b>Left-Click</b> to break blocks or attack, <b>Right-Click</b> to place blocks. Look out for chests!</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-500/20 rounded flex-shrink-0">
                  <Mountain className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-md sm:text-lg font-bold text-white mb-0.5">Objective</h3>
                  <p className="text-sm text-[var(--ui-text-dim)] leading-tight">Explore the floating islands, gather gear, level up your skills, and conquer the realms with friends.</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="mt-2 py-3 bg-[var(--ui-primary)] hover:bg-[var(--ui-primary-hover)] active:bg-[var(--ui-primary-active)] text-white font-bold rounded shadow-sm hover:shadow-md transition-all uppercase tracking-wider text-sm border border-black/20"
            >
              Start Playing
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
