import React from "react";
import { useUIStore } from "../store/uiStore";
import { motion, AnimatePresence } from "motion/react";
import { Play } from "lucide-react";
import { CrazyGamesManager } from "../game/CrazyGamesManager";

interface TutorialUIProps {
  handleRelock?: () => void;
}

export const TutorialUI: React.FC<TutorialUIProps> = ({ handleRelock }) => {
  const showTutorialPopup = useUIStore((state) => state.showTutorialPopup);
  const isLaunchMenuOpen = useUIStore((state) => state.isLaunchMenuOpen);
  const setShowTutorialPopup = useUIStore((state) => state.setShowTutorialPopup);

  const handleClose = () => {
    setShowTutorialPopup(false);
    CrazyGamesManager.gameplayStart();
    handleRelock?.();
  };

  return (
    <AnimatePresence>
      {showTutorialPopup && !isLaunchMenuOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto bg-white/30 backdrop-blur-sm">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-lg bg-white border border-zinc-200/80 p-2 rounded-2xl shadow-2xl flex flex-col items-center"
          >
            <div className="w-full rounded-xl overflow-hidden mb-2">
              <img 
                src="https://raw.githubusercontent.com/susu532/sounds/main/minecraft/1.png" 
                alt="Tutorial" 
                className="w-full h-auto object-contain bg-white" 
                loading="lazy"
              />
            </div>

            <div className="p-2 w-full">
              <button
                onClick={handleClose}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 uppercase tracking-wide text-sm"
              >
                <Play className="w-5 h-5 fill-current" />
                Start Playing
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
