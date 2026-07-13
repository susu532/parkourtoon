import React, { useState, useEffect } from "react";
import { useUI } from "../store/uiStore";
import { settingsManager } from "../game/Settings";
import {
  User,
  Settings,
  RotateCcw,
  Info,
  Sparkles,
  X,
  BookOpen,
  ArrowRight,
  Sparkle,
  Music,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { networkManager } from "../game/NetworkManager";
import { audioManager } from "../game/AudioManager";
import { CrazyGamesManager } from "../game/CrazyGamesManager";
import { PlayerPreview } from "./inventory/PlayerPreview";

// A beautifully styled authentic Minecraft button component with support for non-dark, cheerful colors!
interface MinecraftBtnProps {
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "green" | "blue" | "yellow" | "neutral" | "red";
  size?: "normal" | "large" | "giant";
}

const MinecraftButton: React.FC<MinecraftBtnProps> = ({
  onClick,
  children,
  className = "",
  disabled,
  variant = "neutral",
  size = "normal",
}) => {
  const handlePlayClick = (e: React.MouseEvent) => {
    audioManager.play("click", 0.5, 1.0);
    if (onClick) onClick(e);
  };

  // Define beautiful bright non-dark Minecraft colored themes
  let colors = {
    bg: "bg-[#ebdcb9]",
    hover: "hover:bg-[#f4ebd5]",
    active: "active:bg-[#dcceaa]",
    insetTop: "#fff3d6",
    insetBottom: "#b1a281",
    textShadow: "#403828",
  };

  if (variant === "green") {
    // Vibrant grass fields / adventure theme
    colors = {
      bg: "bg-[#55b436]",
      hover: "hover:bg-[#68c649]",
      active: "active:bg-[#439626]",
      insetTop: "#96e87b",
      insetBottom: "#2d6a19",
      textShadow: "#15360a",
    };
  } else if (variant === "blue") {
    // Clear summer skies theme
    colors = {
      bg: "bg-[#4ba3e3]",
      hover: "hover:bg-[#62b4f2]",
      active: "active:bg-[#3286c4]",
      insetTop: "#a2deff",
      insetBottom: "#1c5a88",
      textShadow: "#09253d",
    };
  } else if (variant === "yellow") {
    // Bright sun/gold gold blocks theme
    colors = {
      bg: "bg-[#f4be2a]",
      hover: "hover:bg-[#fade4b]",
      active: "active:bg-[#d49e13]",
      insetTop: "#fffa8f",
      insetBottom: "#936a08",
      textShadow: "#4d3702",
    };
  } else if (variant === "red") {
    // Joyful redstone/poppy theme
    colors = {
      bg: "bg-[#ef4444]",
      hover: "hover:bg-[#f87171]",
      active: "active:bg-[#dc2626]",
      insetTop: "#fca5a5",
      insetBottom: "#991b1b",
      textShadow: "#5c0b0b",
    };
  }

  // Size mapping
  let sizeClasses = "px-4 py-3 text-sm";
  if (size === "large") {
    sizeClasses = "px-6 py-4 text-lg md:text-xl";
  } else if (size === "giant") {
    sizeClasses = "px-8 py-5 text-xl md:text-2xl lg:text-3xl";
  }

  return (
    <button
      onClick={handlePlayClick}
      disabled={disabled}
      className={`relative w-full ${sizeClasses} ${colors.bg} ${colors.hover} ${colors.active} border-[3px] border-black flex items-center justify-center cursor-pointer transition-all active:translate-y-[2px] ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      style={{
        boxShadow: `inset 3px 3px 0px ${colors.insetTop}, inset -3px -3px 0px ${colors.insetBottom}`,
        imageRendering: "pixelated",
      }}
    >
      <span
        className="text-white text-center tracking-wider font-extrabold select-none uppercase"
        style={{
          fontFamily: '"Minecraftia", "Courier New", monospace',
          textShadow: `3px 3px 0px ${colors.textShadow}`,
        }}
      >
        {children}
      </span>
    </button>
  );
};

const parseSkinSeed = (seedString: string) => {
  if (seedString && seedString.startsWith("custom:")) {
    const p = seedString.split(":");
    return {
      skin: p[1] || "#ffccaa",
      hair: p[2] || "#fde047",
      eye: p[3] || "#67e8f9",
      shirt: p[4] || "#ef4444",
      pants: p[5] || "#60a5fa",
      shoe: p[6] || "#ef4444",
      accessory: p[7] !== undefined ? parseInt(p[7]) : 0,
      jacket: p[8] === "true",
      jacketColor: p[9] || "#38bdf8",
      noise: p[10] !== "false",
    };
  }
  return {
    skin: "#ffccaa",
    hair: "#fde047",
    eye: "#67e8f9",
    shirt: "#ef4444",
    pants: "#60a5fa",
    shoe: "#ef4444",
    accessory: 0,
    jacket: true,
    jacketColor: "#38bdf8",
    noise: true,
  };
};

export const HubPageUI: React.FC = () => {
  const isHubPageOpen = useUI((state) => state.isHubPageOpen);
  const setHubPageOpen = useUI((state) => state.setHubPageOpen);
  const setSettingsOpen = useUI((state) => state.setSettingsOpen);

  const [username, setUsername] = useState(
    settingsManager.getSettings().username || "",
  );
  const [error, setError] = useState("");

  const [hasPickedName, setHasPickedName] = useState(false);
  const [loadingInitialState, setLoadingInitialState] = useState(true);

  const [musicVolume, setMusicVolume] = useState(
    () => settingsManager.getSettings().musicVolume,
  );
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => audioManager.getMuted());

  useEffect(() => {
    const unsubscribe = settingsManager.subscribe((settings) => {
      setMusicVolume(settings.musicVolume);
    });

    const handleMuteChange = (e: any) => {
      setIsMuted(e.detail);
    };
    window.addEventListener("audio_mute_change", handleMuteChange);

    return () => {
      unsubscribe();
      window.removeEventListener("audio_mute_change", handleMuteChange);
    };
  }, []);

  // Sub-modal screens (Reduced to only 'info' or 'skin')
  const [activeModal, setActiveModal] = useState<"none" | "info" | "skin">(
    "none",
  );
  const [newsFeedRefreshes, setNewsFeedRefreshes] = useState(0);

  // Custom Skin Changer smart states
  const [skinTab, setSkinTab] = useState<"presets" | "face" | "clothing">(
    "presets",
  );
  const [skinOptions, setSkinOptions] = useState(() => {
    const currentSeed = localStorage.getItem("skyBridge_skin_seed") || "";
    return parseSkinSeed(currentSeed);
  });
  const [currentSkinSeed, setCurrentSkinSeed] = useState(
    () => localStorage.getItem("skyBridge_skin_seed") || "",
  );

  // Synchronize options when modal opens
  useEffect(() => {
    if (activeModal === "skin") {
      const currentSeed = localStorage.getItem("skyBridge_skin_seed") || "";
      setSkinOptions(parseSkinSeed(currentSeed));
    }
  }, [activeModal]);

  useEffect(() => {
    if (isHubPageOpen && document.pointerLockElement) {
      document.exitPointerLock();
    }
  }, [isHubPageOpen]);

  useEffect(() => {
    async function checkName() {
      let foundName = "";

      try {
        if (
          typeof window !== "undefined" &&
          (window as any).CrazyGames?.SDK?.user
        ) {
          const cgUser = await (window as any).CrazyGames.SDK.user.getUser();
          if (cgUser && cgUser.username) {
            foundName = cgUser.username.slice(0, 20);
          }
        }

        if (!foundName) {
           const syncedName = await CrazyGamesManager.getData("username");
           if (syncedName) foundName = syncedName;
        }
      } catch (e) {
        console.warn("CrazyGames SDK get user error", e);
      }

      const settingsName = settingsManager.getSettings().username;

      if (foundName) {
        setUsername(foundName);
        setHasPickedName(true);
        settingsManager.updateSettings({ username: foundName });
        networkManager.updateName(foundName);
      } else if (settingsName && settingsName.trim().length >= 4) {
        setUsername(settingsName);
        setHasPickedName(true);
        networkManager.updateName(settingsName);
        CrazyGamesManager.syncData("username", settingsName);
      } else {
        setHasPickedName(false);
      }
      setLoadingInitialState(false);
    }

    if (isHubPageOpen) {
      checkName();
      audioManager.playMusic("bgm_hub");
    } else {
      audioManager.stopMusic();
    }
  }, [isHubPageOpen]);

  const handleSaveName = () => {
    const trimmed = username.trim();
    if (trimmed.length < 4 || trimmed.length > 20) {
      setError("Username must be between 4 and 20 characters.");
      return;
    }

    settingsManager.updateSettings({ username: trimmed });
    networkManager.updateName(trimmed);
    CrazyGamesManager.syncData("username", trimmed);
    setHasPickedName(true);
  };

  const handleJoinGame = () => {
    setHubPageOpen(false);
  };

  const handleRefreshNews = () => {
    audioManager.play("click", 0.5, 1.4);
    setNewsFeedRefreshes((prev) => prev + 1);
  };

  if (!isHubPageOpen || loadingInitialState) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-[url('https://raw.githubusercontent.com/susu532/sounds/main/minecraft/a_resize_this_image_to.jpeg')] bg-cover bg-center font-sans tracking-wide pointer-events-auto select-none"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Light decorative sunny border for premium feel instead of dark vignette */}
      <div className="absolute inset-0 bg-yellow-500/5 mix-blend-color-burn pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-orange-400/10 via-transparent to-sky-400/5 pointer-events-none" />

      <AnimatePresence mode="wait">
        {!hasPickedName ? (
          /* Choose Name Picker Dialog styled with bright cheerful desert-temple colors */
          <motion.div
            key="name-picker"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 w-full max-w-md max-h-[95dvh] landscape:max-h-[95dvh] overflow-y-auto bg-[#faf6ee] border-[4px] border-black p-4 sm:p-8 landscape:p-4 flex flex-col items-center"
            style={{
              boxShadow:
                "inset 4px 4px 0px #fffdf8, inset -4px -4px 0px #dccbab, 0 16px 40px rgba(0,0,0,0.25)",
            }}
          >
            <div
              className="w-12 h-12 sm:w-16 sm:h-16 landscape:w-12 landscape:h-12 bg-[#ffd56b] border-2 border-black flex items-center justify-center mb-3 sm:mb-6 landscape:mb-3 shadow-inner"
              style={{
                boxShadow:
                  "inset 3px 3px 0px #ffeaa3, inset -3px -3px 0px #cda032",
              }}
            >
              <User className="w-6 h-6 sm:w-8 sm:h-8 landscape:w-6 landscape:h-6 text-[#5c3e03] fill-current" />
            </div>

            <h1
              className="text-lg sm:text-2xl landscape:text-lg font-bold text-[#4d3608] mb-1 sm:mb-2 landscape:mb-1 text-center tracking-tight"
              style={{ fontFamily: '"Minecraftia", monospace' }}
            >
              CHOOSE USERNAME
            </h1>
            <p className="text-amber-800/80 mb-3 sm:mb-6 landscape:mb-3 text-center text-[10px] sm:text-xs font-bold tracking-wider uppercase">
              Enter nickname to proceed
            </p>

            <div className="w-full mb-3 sm:mb-6 landscape:mb-3">
              <input
                autoFocus
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                placeholder="Choose nickname..."
                className="w-full bg-[#fffff8] border-[3px] border-black text-center text-[#3c2a05] px-3 sm:px-4 py-2 sm:py-3 landscape:py-2 placeholder-stone-400 font-extrabold focus:outline-none focus:border-amber-600 focus:ring-0 text-base sm:text-lg landscape:text-base"
                style={{
                  boxShadow: "inset 3px 3px 0px #ebdcb9",
                  fontFamily: '"Minecraftia", monospace',
                }}
                maxLength={20}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                }}
              />
              {error && (
                <p className="text-red-600 font-extrabold text-[10px] sm:text-xs mt-1 sm:mt-2 text-center">
                  {error}
                </p>
              )}
            </div>

            <MinecraftButton
              variant="green"
              size="normal"
              onClick={handleSaveName}
              className="sm:!px-6 sm:!py-4 sm:!text-lg landscape:!px-4 landscape:!py-3 landscape:!text-sm"
            >
              CONTINUE
            </MinecraftButton>
          </motion.div>
        ) : (
          /* Full Screen layout with increased elements size and bright non-dark colors */
          <motion.div
            key="lobby-hub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 w-full h-full min-h-[100dvh] flex flex-col justify-between p-2 sm:p-4 landscape:p-2 overflow-y-auto overflow-x-hidden safe-pb safe-pt"
          >
            {/* Top Bar Left: Brand Logo in beautiful bright blocky format */}
            <div className="flex items-center gap-3 self-start select-none">
              <div
                className="bg-[#ffd700] border-[3px] border-black p-2 py-1.5 flex items-center gap-2 shadow-md"
                style={{
                  boxShadow:
                    "inset 2px 2px 0px #fff7b5, inset -2px -2px 0px #b89100",
                }}
              >
                <Sparkle className="w-4 h-4 text-amber-900 fill-current animate-pulse" />
                <span
                  className="text-amber-950 text-sm md:text-base font-black tracking-widest uppercase"
                  style={{ fontFamily: '"Minecraftia", monospace' }}
                >
                  Parkourtoon
                </span>
              </div>
            </div>

            {/* Top Bar Right: Profile change indicator & Info Button */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-2 sm:gap-4 z-50">
              {/* Username label in cheerful non-dark cream/gold style */}
              <div
                className="bg-[#faf6ee] border-[3px] border-black p-2 py-1.5 hidden landscape:flex sm:flex items-center gap-2 sm:gap-4 shadow-md"
                style={{
                  boxShadow:
                    "inset 2px 2px 0px #ffffff, inset -2px -2px 0px #ddcaa9",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  <span
                    className="text-[#513606] font-black text-xs sm:text-sm tracking-wide"
                    style={{ fontFamily: '"Minecraftia", monospace' }}
                  >
                    {username}
                  </span>
                </div>
                <button
                  onClick={() => {
                    audioManager.play("click", 0.5, 0.9);
                    setHasPickedName(false);
                  }}
                  className="text-amber-700 hover:text-amber-950 text-[10px] sm:text-xs uppercase font-extrabold tracking-widest border-l-[2px] border-amber-300 pl-2 sm:pl-4 transition-colors"
                >
                  Change
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 relative">
                {/* Volume Slider & Mute Button */}
                <div
                  className="relative group flex items-center justify-center"
                  onMouseEnter={() => setIsVolumeOpen(true)}
                  onMouseLeave={() => setIsVolumeOpen(false)}
                >
                  <button
                    onClick={() => {
                      audioManager.play("click", 0.5, 1.0);
                      const newMuted = !isMuted;
                      audioManager.setMuted(newMuted);
                    }}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-[#ebdcb9] hover:bg-[#f4ebd5] active:bg-[#dcceaa] hover:scale-105 active:scale-95 border-[3px] border-black rounded-full flex items-center justify-center transition-all shadow-md relative z-20"
                    style={{
                      boxShadow:
                        "inset 2px 2px 0px #fff3d6, inset -2px -2px 0px #b1a281",
                    }}
                    title="Volume & Mute"
                  >
                    {isMuted || musicVolume === 0 ? (
                      <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-[#513606]" />
                    ) : (
                      <Music className="w-5 h-5 sm:w-6 sm:h-6 text-[#513606]" />
                    )}
                  </button>
                  <AnimatePresence>
                    {isVolumeOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full mt-2 bg-[#ebdcb9] border-[3px] border-black rounded-lg p-2 sm:p-3 py-3 sm:py-4 shadow-xl z-10 flex flex-col items-center justify-center"
                        style={{
                          boxShadow:
                            "inset 2px 2px 0px #fff3d6, inset -2px -2px 0px #b1a281, 0 4px 6px rgba(0,0,0,0.3)",
                        }}
                      >
                        <div
                          className="w-3 h-20 sm:h-24 bg-[#f4ebd5] rounded-sm relative cursor-pointer border border-[#302003]"
                          onPointerDown={(e) => {
                            e.currentTarget.setPointerCapture(e.pointerId);
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const y = e.clientY - rect.top;
                            // 0 at top, 1 at bottom
                            let v = Math.max(0, Math.min(1, y / rect.height));
                            setMusicVolume(v);
                            settingsManager.updateSettings({ musicVolume: v });
                            if (isMuted && v > 0) {
                              audioManager.setMuted(false);
                            }
                          }}
                          onPointerMove={(e) => {
                            if (e.buttons === 1) {
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              const y = e.clientY - rect.top;
                              // 0 at top, 1 at bottom
                              let v = Math.max(0, Math.min(1, y / rect.height));
                              setMusicVolume(v);
                              settingsManager.updateSettings({
                                musicVolume: v,
                              });
                              if (isMuted && v > 0) {
                                audioManager.setMuted(false);
                              }
                            }
                          }}
                        >
                          <div
                            className="absolute top-0 left-0 w-full bg-[#513606] pointer-events-none"
                            style={{ height: `${musicVolume * 100}%` }}
                          />
                          <div
                            className="absolute left-1/2 w-6 sm:w-7 h-2 sm:h-3 bg-white border-[2px] border-black pointer-events-none rounded-sm shadow-sm"
                            style={{
                              top: `${musicVolume * 100}%`,
                              transform: "translate(-50%, -50%)",
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Help & Info instruction sheet */}
              <button
                onClick={() => {
                  audioManager.play("click", 0.5, 1.0);
                  setActiveModal(activeModal === "info" ? "none" : "info");
                }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-[#ebdcb9] hover:bg-[#f4ebd5] active:bg-[#dcceaa] hover:scale-105 active:scale-95 border-[3px] border-black rounded-full flex items-center justify-center transition-all shadow-md"
                style={{
                  boxShadow:
                    "inset 2px 2px 0px #fff3d6, inset -2px -2px 0px #b1a281",
                }}
                title="Controls & Instructions"
              >
                <Info className="w-5 h-5 sm:w-6 sm:h-6 text-[#513606]" />
              </button>
            </div>

            {/* Centered Main Section: Large play & settings row/column next to the bright news panel */}
            <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col md:grid md:grid-cols-12 gap-3 sm:gap-6 lg:gap-8 items-center justify-center py-2 sm:py-6 landscape:py-2">
              {/* LEFT COLUMN: Giant play and settings buttons */}
              <div className="col-span-6 w-full flex flex-col gap-3 sm:gap-6 max-w-sm sm:max-w-lg select-none mx-auto">
                {/* Majestic gigantic Quick Play button in minty adventure green */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-yellow-400 rounded-lg blur-sm group-hover:opacity-100 opacity-60 transition duration-500" />
                  <MinecraftButton
                    variant="green"
                    size="large"
                    onClick={handleJoinGame}
                    className="relative sm:!text-2xl landscape:!py-3"
                  >
                    Play
                  </MinecraftButton>
                </div>

                {/* Settings button in sky blue, also larger! */}
                <MinecraftButton
                  variant="blue"
                  size="normal"
                  onClick={() => {
                    setSettingsOpen(true);
                    setHubPageOpen(false);
                  }}
                  className="sm:!text-xl landscape:!py-2"
                >
                  Settings Menu
                </MinecraftButton>
              </div>

              {/* RIGHT COLUMN: Bright Parchment Map style News Panel (No dark backgrounds!) */}
              <div
                className="col-span-6 w-full max-w-sm sm:max-w-lg mx-auto bg-[#faf6ee] border-[4px] border-black flex flex-col mt-4 md:mt-0 h-[200px] sm:h-[350px] landscape:h-[180px] sm:landscape:h-[240px]"
                style={{
                  boxShadow:
                    "inset 4px 4px 0px #fffdf8, inset -4px -4px 0px #ddcca9, 0 16px 48px rgba(0,0,0,0.2)",
                }}
              >
                {/* Bright News Title Header Bar (styled like Birch Planks) */}
                <div
                  className="bg-[#ebdcb9] border-b-[4px] border-black p-2 sm:p-4 px-3 sm:px-5 flex items-center justify-between select-none shrink-0"
                  style={{ boxShadow: "inset 0 3px 0px #fff3d6" }}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-900" />
                    <span
                      className="text-amber-950 font-black text-sm sm:text-xl tracking-wider uppercase"
                      style={{ fontFamily: '"Minecraftia", monospace' }}
                    >
                      News
                    </span>
                  </div>
                  {/* Refresh icon action */}
                  <button
                    onClick={handleRefreshNews}
                    className="p-1 sm:p-1.5 bg-[#f4ebd5] hover:bg-[#ffeecf] text-amber-900 hover:text-amber-950 border-2 border-black transition-all active:translate-y-[1px]"
                  >
                    <RotateCcw
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${newsFeedRefreshes > 0 ? "animate-[spin_1s_ease]" : ""}`}
                    />
                  </button>
                </div>

                {/* Parchment scroll update feed content */}
                <div className="p-2 sm:p-4 flex-1 flex flex-col min-h-0 text-left overflow-hidden">
                  <div
                    className="bg-[#fffff4] border-[3px] border-black p-2 sm:p-4 flex-1 rounded-sm overflow-y-auto min-h-0 custom-scrollbar"
                    style={{ boxShadow: "inset 3px 3px 0px #ebdcb9" }}
                  >
                    <h3
                      className="text-sm sm:text-lg font-black text-amber-900 tracking-tight mb-1 sm:mb-2 uppercase"
                      style={{ fontFamily: '"Minecraftia", monospace' }}
                    >
                      PATCH 1.0.4
                    </h3>

                    <ul
                      className="text-[10px] sm:text-xs text-amber-950 font-extrabold space-y-1 sm:space-y-3 mb-2 sm:mb-5 leading-tight sm:leading-relaxed"
                      style={{ fontFamily: '"Minecraftia", monospace' }}
                    >
                      <li className="flex items-start gap-2">
                        <span className="text-green-600">✦</span>
                        <span>
                          NEW ARCHER ROLE :YOU CAN BE SILLY AND MAKE IT HARDER FOR OTHER PLAYERS TO PARKOUR!
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Version specifications on Left, Skin Avatar rendering on Right */}
            <div className="flex justify-between items-end w-full relative z-50">
              {/* Bottom Left Version Tag */}
              <div
                className="text-amber-950 text-[10px] sm:text-xs font-black drop-shadow-[1px_1px_0px_rgba(255,255,255,0.85)] select-none pl-2 sm:pl-0"
                style={{ fontFamily: '"Minecraftia", monospace' }}
              >
                Parkourtoon Online: v1.0.4
              </div>

              {/* Bottom Right Skin Showcase Area */}
              <div className="flex flex-col items-center gap-1 sm:gap-2 select-none pr-2 sm:pr-4">
                {/* Real 3D interactive Skin Preview */}
                <div
                  className="relative group p-1 sm:p-2 bg-[#faf6ee] border-[3px] border-black hover:bg-[#fffff8] transition-all cursor-pointer rounded-lg shadow-md"
                  style={{
                    boxShadow:
                      "inset 2px 2px 0px #ffffff, inset -2px -2px 0px #ddcaa9",
                  }}
                  onClick={() => audioManager.play("click", 0.5, 0.8)}
                >
                  <PlayerPreview scale={4} seed={currentSkinSeed || username} />

                  {/* Miniature text tag */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ffd700] border-2 border-black text-[7px] sm:text-[9px] font-black text-amber-950 px-1 sm:px-2 py-0.5 rounded-full whitespace-nowrap animate-bounce shadow">
                    ★ ACTIVE SKIN ★
                  </div>
                </div>

                {/* Skin Selector change key triggers Name Picker modal! */}
                <button
                  onClick={() => {
                    audioManager.play("click", 0.5, 1.0);
                    setActiveModal("skin");
                  }}
                  className="px-3 sm:px-6 py-1 sm:py-2 bg-[#f4be2a] hover:bg-[#fade4b] active:bg-[#d49e13] border-2 border-black flex items-center justify-center cursor-pointer transition-all active:translate-y-[2px]"
                  style={{
                    boxShadow:
                      "inset 2px 2px 0px #fffa8f, inset -2px -2px 0px #936a08",
                    height: "28px",
                  }}
                >
                  <span
                    className="text-amber-950 text-[10px] sm:text-xs font-black"
                    style={{ fontFamily: '"Minecraftia", monospace' }}
                  >
                    Change Skin
                  </span>
                </button>
              </div>
            </div>

            {/* MODALS GATEWAY: Help & Instructions Popup */}
            <AnimatePresence>
              {activeModal !== "none" && (
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center z-50 p-2 sm:p-4 font-sans overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className={`relative w-full ${activeModal === "skin" ? "max-w-4xl max-h-[95vh] md:h-[80vh] flex md:flex-row flex-col p-[2px] overflow-y-auto md:overflow-hidden" : "max-w-md p-6 overflow-hidden"} bg-[#faf6ee] border-[4px] border-black flex flex-col`}
                    style={{
                      boxShadow:
                        "inset 3px 3px 0px #ffffff, inset -3px -3px 0px #ddcca9, 0 20px 50px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* Close button top right in modal */}
                    {activeModal !== "skin" && (
                      <button
                        onClick={() => {
                          audioManager.play("click", 0.5, 0.8);
                          setActiveModal("none");
                        }}
                        className="absolute top-3 right-3 p-1 hover:bg-[#ebdcb9] text-amber-900 border-2 border-transparent active:border-black rounded-sm z-50"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}

                    {/* DUAL PANE SKIN EDITOR */}
                    {activeModal === "skin" &&
                      (() => {
                        const getSeedString = (opts: typeof skinOptions) => {
                          return `custom:${opts.skin}:${opts.hair}:${opts.eye}:${opts.shirt}:${opts.pants}:${opts.shoe}:${opts.accessory}:${opts.jacket}:${opts.jacketColor}:${opts.noise}`;
                        };

                        const skinColors = [
                          "#ffccaa",
                          "#f1c27d",
                          "#ffdeba",
                          "#ffeac4",
                          "#ffebdc",
                          "#e0ac69",
                          "#8d5524",
                          "#c68642",
                        ];
                        const hairColors = [
                          "#fde047",
                          "#fca5a5",
                          "#67e8f9",
                          "#bef264",
                          "#c084fc",
                          "#fdba74",
                          "#475569",
                          "#1e293b",
                        ];
                        const eyeColors = [
                          "#67e8f9",
                          "#86efac",
                          "#fca5a5",
                          "#c084fc",
                          "#fde047",
                          "#ffffff",
                          "#1e293b",
                        ];
                        const shirtColors = [
                          "#ef4444",
                          "#3b82f6",
                          "#22c55e",
                          "#eab308",
                          "#a855f7",
                          "#ec4899",
                          "#ffffff",
                          "#10b981",
                          "#1e293b",
                        ];
                        const pantsColors = [
                          "#60a5fa",
                          "#38bdf8",
                          "#4ade80",
                          "#f472b6",
                          "#c084fc",
                          "#fbbf24",
                          "#475569",
                          "#1e293b",
                        ];
                        const shoeColors = [
                          "#ef4444",
                          "#3b82f6",
                          "#22c55e",
                          "#eab308",
                          "#475569",
                          "#1e293b",
                          "#ffffff",
                        ];

                        const accessories = [
                          { id: -1, name: "None", label: "🚫 None" },
                          { id: 0, name: "Glasses", label: "🕶️ Glasses" },
                          { id: 1, name: "Headband", label: "🎗️ Headband" },
                          { id: 2, name: "Crown", label: "👑 Gold Crown" },
                          { id: 3, name: "Headset", label: "🎧 Headset" },
                          { id: 4, name: "Cute Ears", label: "😺 Neko Ears" },
                          { id: 5, name: "Full Mask", label: "🥷 Ninja Mask" },
                        ];

                        const presets = [
                          {
                            name: "Classic Hero",
                            seed: "custom:#ffccaa:#fdba74:#67e8f9:#3b82f6:#60a5fa:#ef4444:-1:false:#38bdf8:true",
                            desc: "The timeless voxel champion ready for anything.",
                          },
                          {
                            name: "Spider-Man",
                            seed: "custom:#ffccaa:#ef4444:#ffffff:#ef4444:#3b82f6:#ef4444:5:true:#ef4444:true",
                            desc: "Your friendly neighborhood blocky web-slinger hero!",
                          },
                          {
                            name: "Gilded Monarch",
                            seed: "custom:#ffeac4:#fde047:#ef4444:#fbbf24:#eab308:#fbbf24:2:true:#ffd700:true",
                            desc: "Noble royal styled with golden armor, crown & crown jewels.",
                          },
                          {
                            name: "Stealth Ninja",
                            seed: "custom:#ffeac4:#1e293b:#ef4444:#1e293b:#1e293b:#1e293b:5:true:#1e293b:true",
                            desc: "A shadow mercenary draped in midnight black garments.",
                          },
                          {
                            name: "Cyber Kitty",
                            seed: "custom:#ffdeba:#fca5a5:#67e8f9:#ec4899:#60a5fa:#ec4899:3:true:#ec4899:true",
                            desc: "Ultra-modern neon pink design equipped with cat headset.",
                          },
                          {
                            name: "Aqua Sorcerer",
                            seed: "custom:#ffebdc:#67e8f9:#10b981:#06b6d4:#38bdf8:#06b6d4:0:true:#38bdf8:true",
                            desc: "Mystic traveler with deep glowing teal hair & magic specs.",
                          },
                        ];

                        const previewSeed = getSeedString(skinOptions);

                        return (
                          <div className="flex md:flex-row flex-col w-full h-auto md:h-full md:overflow-hidden">
                            {/* LEFT PANEL: Live preview pedestal and global toggles */}
                            <div
                              className="md:w-[40%] w-full bg-[#ebdcb9] border-r-0 md:border-r-[4px] border-b-[4px] md:border-b-0 border-black p-4 flex flex-col items-center justify-between relative shrink-0 min-h-[300px]"
                              style={{ boxShadow: "inset 0 3px 0px #fff3d6" }}
                            >
                              {/* Close button for entire customizer */}
                              <button
                                onClick={() => {
                                  audioManager.play("click", 0.5, 0.8);
                                  setActiveModal("none");
                                }}
                                className="absolute top-3 left-3 px-2 py-1 bg-amber-950/15 hover:bg-amber-950/35 border-2 border-transparent active:border-black rounded-lg text-xs font-black text-amber-950"
                                style={{
                                  fontFamily: '"Minecraftia", monospace',
                                }}
                              >
                                ◀ Back
                              </button>

                              <div className="text-center w-full mt-2">
                                <h3
                                  className="text-sm font-black text-amber-950 tracking-wider mb-0.5"
                                  style={{
                                    fontFamily: '"Minecraftia", monospace',
                                  }}
                                >
                                  CHARACTER CANVAS
                                </h3>
                                <p className="text-[9px] text-amber-900/80 font-black uppercase tracking-widest leading-none">
                                  Smart Skin Creator
                                </p>
                              </div>

                              {/* Pedestal / Model display inside a nice gold card */}
                              <div className="my-auto flex flex-col items-center justify-center p-2 relative h-48 md:h-64">
                                <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl animate-pulse pointer-events-none" />

                                <div
                                  className="relative group p-2 bg-[#faf6ee] border-[3px] border-black rounded-xl shadow-lg scale-105 md:scale-110 mb-3"
                                  style={{
                                    boxShadow:
                                      "inset 2px 2px 0px #ffffff, inset -2px -2px 0px #ddcaa9",
                                  }}
                                >
                                  <PlayerPreview scale={6} seed={previewSeed} />

                                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#22c55e] border-2 border-black text-[8px] font-black text-white px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap uppercase tracking-widest">
                                    ★ Live view ★
                                  </div>
                                </div>
                              </div>

                              {/* Options block */}
                              <div className="w-full bg-[#faf6ee]/80 border-2 border-black p-3 space-y-2 text-xs font-extrabold text-amber-950 rounded shadow-inner">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={skinOptions.noise}
                                    onChange={(e) => {
                                      audioManager.play("click", 0.5, 1.1);
                                      setSkinOptions((prev) => ({
                                        ...prev,
                                        noise: e.target.checked,
                                      }));
                                    }}
                                    className="w-4 h-4 accent-amber-600 border-2 border-black rounded-sm"
                                  />
                                  <span
                                    style={{
                                      fontFamily: '"Minecraftia", monospace',
                                    }}
                                    className="text-[10px]"
                                  >
                                    HD shading noise
                                  </span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={skinOptions.jacket}
                                    onChange={(e) => {
                                      audioManager.play("click", 0.5, 1.1);
                                      setSkinOptions((prev) => ({
                                        ...prev,
                                        jacket: e.target.checked,
                                      }));
                                    }}
                                    className="w-4 h-4 accent-amber-600 border-2 border-black rounded-sm"
                                  />
                                  <span
                                    style={{
                                      fontFamily: '"Minecraftia", monospace',
                                    }}
                                    className="text-[10px]"
                                  >
                                    Equip Extra Jacket Layer
                                  </span>
                                </label>
                              </div>
                            </div>

                            {/* RIGHT PANEL: Category selectors */}
                            <div className="md:w-[60%] w-full flex flex-col md:h-full h-auto bg-[#faf6ee] min-h-0">
                              {/* Tabs Header banner */}
                              <div className="flex border-b-[4px] border-black bg-[#ebdcb9] shrink-0 sticky top-0 z-10">
                                {(["presets", "face", "clothing"] as const).map(
                                  (tab) => (
                                    <button
                                      key={tab}
                                      onClick={() => {
                                        audioManager.play("click", 0.5, 1.0);
                                        setSkinTab(tab);
                                      }}
                                      className={`flex-1 py-3 text-[10px] sm:text-xs font-black tracking-widest uppercase border-r-2 last:border-r-0 border-black transition-all ${
                                        skinTab === tab
                                          ? "bg-[#faf6ee] text-amber-950 translate-y-[2px] border-b-2 border-b-[#faf6ee]"
                                          : "bg-transparent text-amber-900 hover:bg-[#ebdcb9]/50"
                                      }`}
                                      style={{
                                        fontFamily: '"Minecraftia", monospace',
                                      }}
                                    >
                                      {tab}
                                    </button>
                                  ),
                                )}
                              </div>

                              {/* Color settings list */}
                              <div className="p-4 sm:p-6 flex-1 md:overflow-y-auto overflow-visible space-y-6 min-h-0">
                                {/* TAB 1: PRESETS */}
                                {skinTab === "presets" && (
                                  <div className="space-y-4">
                                    <h4
                                      className="text-xs font-black text-amber-950 uppercase tracking-wider"
                                      style={{
                                        fontFamily: '"Minecraftia", monospace',
                                      }}
                                    >
                                      Superhero Presets List
                                    </h4>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                                      {presets.map((p) => {
                                        const isActive = previewSeed === p.seed;
                                        return (
                                          <button
                                            key={p.name}
                                            onClick={() => {
                                              audioManager.play(
                                                "level_up",
                                                0.5,
                                                1.3,
                                              );
                                              setSkinOptions(
                                                parseSkinSeed(p.seed),
                                              );
                                            }}
                                            className={`p-3 border-2 text-left flex flex-col relative transition-all ${
                                              isActive
                                                ? "border-green-650 bg-[#e6f4ea] ring-2 ring-green-650"
                                                : "border-black bg-[#fffff8] hover:bg-[#ebdcb9]/20"
                                            }`}
                                            style={{
                                              boxShadow: isActive
                                                ? "3px 3px 0px #16a34a"
                                                : "inset 1px 1px 0px #fff, 2px 2px 0px #000",
                                            }}
                                          >
                                            <span
                                              className="text-xs font-black text-amber-950 uppercase"
                                              style={{
                                                fontFamily:
                                                  '"Minecraftia", monospace',
                                              }}
                                            >
                                              {p.name}
                                            </span>
                                            <span className="text-[10px] text-amber-850 font-bold mt-1 leading-tight">
                                              {p.desc}
                                            </span>
                                            {isActive && (
                                              <span className="absolute top-2 right-2 text-green-600 font-extrabold text-xs">
                                                ✔ Equipped
                                              </span>
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>

                                    <div className="bg-[#ebdcb9]/40 border-2 border-black p-3 rounded text-[10px] text-amber-900 font-black uppercase leading-normal">
                                      💡 Tip: You can choose a superhero preset
                                      above as a base, then use the Face and
                                      Clothing tabs to dye the hair, change eye
                                      glows, or add customized ear accessories!
                                    </div>
                                  </div>
                                )}

                                {/* TAB 2: SKIN & HAIR DYES */}
                                {skinTab === "face" && (
                                  <div className="space-y-5">
                                    {/* Skin tone */}
                                    <div className="space-y-1.5">
                                      <h4
                                        className="text-xs font-black text-amber-950 uppercase tracking-widest"
                                        style={{
                                          fontFamily:
                                            '"Minecraftia", monospace',
                                        }}
                                      >
                                        👤 Skin Tone Color
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {skinColors.map((col) => (
                                          <button
                                            key={col}
                                            onClick={() => {
                                              audioManager.play(
                                                "click",
                                                0.5,
                                                1.2,
                                              );
                                              setSkinOptions((prev) => ({
                                                ...prev,
                                                skin: col,
                                              }));
                                            }}
                                            className="w-10 h-10 border-2 border-black transition-transform active:scale-95 relative rounded-md shadow-sm"
                                            style={{
                                              backgroundColor: col,
                                              boxShadow:
                                                skinOptions.skin === col
                                                  ? "0 0 0 3px #16a34a, inset 2px 2px 0px rgba(255,255,255,0.4)"
                                                  : "inset 2px 2px 0px rgba(255,255,255,0.2)",
                                            }}
                                          >
                                            {skinOptions.skin === col && (
                                              <span className="absolute inset-0 flex items-center justify-center text-white text-xs drop-shadow font-black">
                                                ✓
                                              </span>
                                            )}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Hairstyle/Hair color */}
                                    <div className="space-y-1.5">
                                      <h4
                                        className="text-xs font-black text-amber-950 uppercase tracking-widest"
                                        style={{
                                          fontFamily:
                                            '"Minecraftia", monospace',
                                        }}
                                      >
                                        💇 Hair & Beard Dye
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {hairColors.map((col) => (
                                          <button
                                            key={col}
                                            onClick={() => {
                                              audioManager.play(
                                                "click",
                                                0.5,
                                                1.2,
                                              );
                                              setSkinOptions((prev) => ({
                                                ...prev,
                                                hair: col,
                                              }));
                                            }}
                                            className="w-10 h-10 border-2 border-black transition-transform active:scale-95 relative rounded-md"
                                            style={{
                                              backgroundColor: col,
                                              boxShadow:
                                                skinOptions.hair === col
                                                  ? "0 0 0 3px #16a34a, inset 2px 2px 0px rgba(255,255,255,0.4)"
                                                  : "inset 2px 2px 0px rgba(255,255,255,0.2)",
                                            }}
                                          >
                                            {skinOptions.hair === col && (
                                              <span className="absolute inset-0 flex items-center justify-center text-white text-xs drop-shadow font-black">
                                                ✓
                                              </span>
                                            )}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Glowing eyes color */}
                                    <div className="space-y-1.5">
                                      <h4
                                        className="text-xs font-black text-amber-950 uppercase tracking-widest"
                                        style={{
                                          fontFamily:
                                            '"Minecraftia", monospace',
                                        }}
                                      >
                                        👁️ Glowing Pupil Color
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {eyeColors.map((col) => (
                                          <button
                                            key={col}
                                            onClick={() => {
                                              audioManager.play(
                                                "click",
                                                0.5,
                                                1.2,
                                              );
                                              setSkinOptions((prev) => ({
                                                ...prev,
                                                eye: col,
                                              }));
                                            }}
                                            className="w-10 h-10 border-2 border-black transition-transform active:scale-95 relative rounded-md"
                                            style={{
                                              backgroundColor: col,
                                              boxShadow:
                                                skinOptions.eye === col
                                                  ? "0 0 0 3px #16a34a, inset 2px 2px 0px rgba(255,255,255,0.4)"
                                                  : "inset 2px 2px 0px rgba(255,255,255,0.2)",
                                            }}
                                          >
                                            {skinOptions.eye === col && (
                                              <span className="absolute inset-0 flex items-center justify-center text-white text-xs drop-shadow font-black">
                                                ✓
                                              </span>
                                            )}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* TAB 3: CLOTHING & GEAR DESIGN */}
                                {skinTab === "clothing" && (
                                  <div className="space-y-5">
                                    {/* Head gears list */}
                                    <div className="space-y-2">
                                      <h4
                                        className="text-xs font-black text-amber-950 uppercase tracking-widest"
                                        style={{
                                          fontFamily:
                                            '"Minecraftia", monospace',
                                        }}
                                      >
                                        🛡️ Wearable Head Item
                                      </h4>
                                      <div className="grid grid-cols-2 gap-2 text-left">
                                        {accessories.map((acc) => {
                                          const isSelected =
                                            skinOptions.accessory === acc.id;
                                          return (
                                            <button
                                              key={acc.id}
                                              onClick={() => {
                                                audioManager.play(
                                                  "click",
                                                  0.5,
                                                  1.1,
                                                );
                                                setSkinOptions((prev) => ({
                                                  ...prev,
                                                  accessory: acc.id,
                                                }));
                                              }}
                                              className={`p-2 border-2 text-[10px] font-black uppercase flex items-center gap-1.5 transition-all outline-none ${
                                                isSelected
                                                  ? "border-green-600 bg-green-50 text-green-900 font-black"
                                                  : "border-black bg-white text-amber-950 hover:bg-[#ebdcb9]/15"
                                              }`}
                                              style={{
                                                boxShadow: isSelected
                                                  ? "2px 2px 0px #16a34a"
                                                  : "inset 1px 1px 0px #fff, 1.5px 1.5px 0px #000",
                                                fontFamily:
                                                  '"Minecraftia", monospace',
                                              }}
                                            >
                                              <span className="text-sm shrink-0">
                                                {acc.label.split(" ")[0]}
                                              </span>
                                              <span>
                                                {acc.label
                                                  .split(" ")
                                                  .slice(1)
                                                  .join(" ")}
                                              </span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Dye palettes */}
                                    <div className="space-y-3.5 pt-3 border-t border-amber-200">
                                      {/* Shirt dye */}
                                      <div className="space-y-1">
                                        <h5
                                          className="text-[10px] font-black text-amber-950 uppercase tracking-wider"
                                          style={{
                                            fontFamily:
                                              '"Minecraftia", monospace',
                                          }}
                                        >
                                          Shirt Color Coating
                                        </h5>
                                        <div className="flex flex-wrap gap-1.5">
                                          {shirtColors.map((col) => (
                                            <button
                                              key={col}
                                              onClick={() => {
                                                audioManager.play(
                                                  "click",
                                                  0.3,
                                                  1.2,
                                                );
                                                setSkinOptions((prev) => ({
                                                  ...prev,
                                                  shirt: col,
                                                }));
                                              }}
                                              className="w-8 h-8 border-2 border-black rounded-sm transition-all relative active:scale-95"
                                              style={{
                                                backgroundColor: col,
                                                boxShadow:
                                                  skinOptions.shirt === col
                                                    ? "0 0 0 2px #16a34a"
                                                    : "inset 1px 1px 0px rgba(255,255,255,0.2)",
                                              }}
                                            />
                                          ))}
                                        </div>
                                      </div>

                                      {/* Pants dye */}
                                      <div className="space-y-1">
                                        <h5
                                          className="text-[10px] font-black text-amber-950 uppercase tracking-wider"
                                          style={{
                                            fontFamily:
                                              '"Minecraftia", monospace',
                                          }}
                                        >
                                          Pants / Leggings Color
                                        </h5>
                                        <div className="flex flex-wrap gap-1.5">
                                          {pantsColors.map((col) => (
                                            <button
                                              key={col}
                                              onClick={() => {
                                                audioManager.play(
                                                  "click",
                                                  0.3,
                                                  1.2,
                                                );
                                                setSkinOptions((prev) => ({
                                                  ...prev,
                                                  pants: col,
                                                }));
                                              }}
                                              className="w-8 h-8 border-2 border-black rounded-sm transition-all relative active:scale-95"
                                              style={{
                                                backgroundColor: col,
                                                boxShadow:
                                                  skinOptions.pants === col
                                                    ? "0 0 0 2px #16a34a"
                                                    : "inset 1px 1px 0px rgba(255,255,255,0.2)",
                                              }}
                                            />
                                          ))}
                                        </div>
                                      </div>

                                      {/* Shoes dye */}
                                      <div className="space-y-1">
                                        <h5
                                          className="text-[10px] font-black text-amber-950 uppercase tracking-wider"
                                          style={{
                                            fontFamily:
                                              '"Minecraftia", monospace',
                                          }}
                                        >
                                          Shoes Color Tone
                                        </h5>
                                        <div className="flex flex-wrap gap-1.5">
                                          {shoeColors.map((col) => (
                                            <button
                                              key={col}
                                              onClick={() => {
                                                audioManager.play(
                                                  "click",
                                                  0.3,
                                                  1.2,
                                                );
                                                setSkinOptions((prev) => ({
                                                  ...prev,
                                                  shoe: col,
                                                }));
                                              }}
                                              className="w-8 h-8 border-2 border-black rounded-sm transition-all relative active:scale-95"
                                              style={{
                                                backgroundColor: col,
                                                boxShadow:
                                                  skinOptions.shoe === col
                                                    ? "0 0 0 2px #16a34a"
                                                    : "inset 1px 1px 0px rgba(255,255,255,0.2)",
                                              }}
                                            />
                                          ))}
                                        </div>
                                      </div>

                                      {/* Jacket Overlay coat if active */}
                                      {skinOptions.jacket && (
                                        <div className="space-y-1 pt-2 border-t border-dashed border-amber-300">
                                          <h5
                                            className="text-[10px] font-black text-[#15803d] uppercase tracking-wider"
                                            style={{
                                              fontFamily:
                                                '"Minecraftia", monospace',
                                            }}
                                          >
                                            🧥 Outer Coat / Protective Armor Dye
                                          </h5>
                                          <div className="flex flex-wrap gap-1.5">
                                            {pantsColors.map((col) => (
                                              <button
                                                key={col}
                                                onClick={() => {
                                                  audioManager.play(
                                                    "click",
                                                    0.3,
                                                    1.2,
                                                  );
                                                  setSkinOptions((prev) => ({
                                                    ...prev,
                                                    jacketColor: col,
                                                  }));
                                                }}
                                                className="w-8 h-8 border-2 border-black rounded-sm transition-all relative active:scale-95"
                                                style={{
                                                  backgroundColor: col,
                                                  boxShadow:
                                                    skinOptions.jacketColor ===
                                                    col
                                                      ? "0 0 0 2px #15803d"
                                                      : "inset 1px 1px 0px rgba(255,255,255,0.2)",
                                                }}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Options action footer */}
                              <div className="p-3 bg-[#ebdcb9] border-t-[4px] border-black flex justify-between gap-3 shrink-0">
                                <button
                                  onClick={() => {
                                    audioManager.play("click", 0.5, 0.7);
                                    setSkinOptions({
                                      skin: "#ffccaa",
                                      hair: "#fdba74",
                                      eye: "#67e8f9",
                                      shirt: "#ef4444",
                                      pants: "#60a5fa",
                                      shoe: "#ef4444",
                                      accessory: -1,
                                      jacket: false,
                                      jacketColor: "#38bdf8",
                                      noise: true,
                                    });
                                  }}
                                  className="px-3 py-2 bg-red-450 hover:bg-red-500 hover:scale-[1.02] border-2 border-black text-[10px] font-black uppercase text-white tracking-widest transition-all"
                                  style={{
                                    backgroundColor: "#ef4444",
                                    fontFamily: '"Minecraftia", monospace',
                                    boxShadow: "inset 2px 2px 0px #fca5a5",
                                  }}
                                >
                                  Reset Dyes
                                </button>

                                <button
                                  onClick={() => {
                                    audioManager.play("level_up", 0.8, 1.0);
                                    const customSeed = previewSeed;
                                    localStorage.setItem(
                                      "skyBridge_skin_seed",
                                      customSeed,
                                    );
                                    setCurrentSkinSeed(customSeed);

                                    // Update running game scene player instantly!
                                    if ((window as any).game?.player) {
                                      (window as any).game.player.updateSkin(
                                        customSeed,
                                      );
                                    }

                                    networkManager.updateProfile({
                                      name: username,
                                      skinSeed: customSeed,
                                    });
                                    setActiveModal("none");
                                  }}
                                  className="px-5 py-2.5 hover:scale-[1.02] border-2 border-black text-[10px] font-black uppercase text-white tracking-widest transition-all"
                                  style={{
                                    backgroundColor: "#16a34a",
                                    fontFamily: '"Minecraftia", monospace',
                                    boxShadow:
                                      "inset 2px 2px 0px #86efac, 2px 2px 0px #000",
                                  }}
                                >
                                  Equip & Save Skin
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                    {/* HELP & CONTROLS CONTROL SHEET */}
                    {activeModal === "info" && (
                      <div className="flex flex-col text-left">
                        <h2
                          className="text-base font-black text-amber-950 mb-4 uppercase text-center"
                          style={{ fontFamily: '"Minecraftia", monospace' }}
                        >
                          Control & Keys Map
                        </h2>

                        <div className="space-y-3.5 text-xs text-amber-900 font-extrabold mb-6 leading-relaxed max-h-56 overflow-y-auto pr-1">
                          <div className="flex justify-between border-b border-amber-200 pb-1.5">
                            <span className="text-amber-950">Movement:</span>
                            <span>W, A, S, D Keys</span>
                          </div>
                          <div className="flex justify-between border-b border-amber-200 pb-1.5">
                            <span className="text-amber-950">Jump:</span>
                            <span>Spacebar</span>
                          </div>
                          <div className="flex justify-between border-b border-amber-200 pb-1.5">
                            <span className="text-amber-950">Sprint:</span>
                            <span>Double-press W or L-Shift</span>
                          </div>
                          <div className="flex justify-between border-b border-amber-200 pb-1.5">
                            <span className="text-amber-950">Break block:</span>
                            <span>Left Mouse Click</span>
                          </div>
                          <div className="flex justify-between border-b border-amber-200 pb-1.5">
                            <span className="text-amber-950">Place block:</span>
                            <span>Right Mouse Click</span>
                          </div>
                          <div className="flex justify-between border-b border-amber-200 pb-1.5">
                            <span className="text-amber-950">
                              Select Block Slot:
                            </span>
                            <span>1 - 9 Keys or Scrollwheel</span>
                          </div>
                          <div className="flex justify-between border-b border-amber-200 pb-1.5">
                            <span className="text-amber-950">
                              Inventory (Loadout):
                            </span>
                            <span>E key</span>
                          </div>
                        </div>

                        <MinecraftButton
                          variant="yellow"
                          onClick={() => setActiveModal("none")}
                        >
                          Close Info
                        </MinecraftButton>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
