// MusicPlayer.tsx
import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useMusicPlayer } from "../../context/MusicPlayerContext";

// ===== Helpers =====
const formatTime = (sec: number) => {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const MusicPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
    expanded,
    setExpanded,
    handlePlayPause,
    handleNext,
    handlePrev,
    onSeekChange,
    handleVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
  } = useMusicPlayer();

  const progress = useMemo(
    () => (duration > 0 ? (position / duration) * 100 : 0),
    [position, duration]
  );

  return (
    <>
      {/* 🟢 Desktop Player */}
      <motion.div
        className="hidden md:flex fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] md:w-4/5 bg-gray-900/90 backdrop-blur-md text-white p-4 items-center justify-between rounded-2xl shadow-xl z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Cover + Info */}
        {currentTrack && (
          <div className="flex items-center gap-4 min-w-[180px]">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-14 h-14 rounded-xl object-cover shadow-md"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "https://placehold.co/100x100?text=No+Cover";
              }}
            />
            <div className="overflow-hidden">
              <p className="font-semibold truncate max-w-[120px]">{currentTrack.title}</p>
              <p className="text-sm text-gray-400 truncate max-w-[120px]">{currentTrack.artist}</p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <SkipBack size={22} />
          </motion.button>

          <motion.button
            onClick={handlePlayPause}
            whileTap={{ scale: 0.85 }}
            className="p-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors shadow-lg"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <SkipForward size={22} />
          </motion.button>
        </div>

        {/* Seek Bar */}
        <div className="flex flex-col items-center flex-1 px-4">
          <input
            type="range"
            min={0}
            max={duration}
            value={position}
            onChange={(e) => onSeekChange(Number(e.target.value))}
            className="w-[70%]  h-1 rounded-lg accent-green-500 cursor-pointer"
          />
          <div className="flex justify-between w-full text-xs text-gray-400 mt-1">
            <span>{formatTime(position)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Progress Bar Animation */}
          <motion.div
            className="absolute bottom-4 left-0 h-1 w-full rounded-full bg-gray-700 mt-1"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>

        {/* Volume + Options */}
        <div className="flex items-center gap-3 min-w-[180px]">
          <motion.button
            onClick={toggleShuffle}
            className={`p-2 rounded-full ${shuffle ? "bg-green-500/70" : "hover:bg-gray-700"}`}
            whileHover={{ scale: 1.2 }}
          >
            <Shuffle size={20} />
          </motion.button>

          <motion.button
            onClick={cycleRepeat}
            className={`p-2 rounded-full ${repeat !== "off" ? "bg-green-500/70" : "hover:bg-gray-700"}`}
            whileHover={{ scale: 1.2 }}
          >
            <Repeat size={20} />
          </motion.button>

          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="p-1 rounded-full hover:bg-gray-700 transition-colors">
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => handleVolume(Number(e.target.value))}
              className="w-16 h-1 rounded-lg accent-green-500 cursor-pointer"
            />
          </div>

          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.2 }}
          >
            {expanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </motion.button>
        </div>
      </motion.div>

      {/* 🟢 Mobile Mini Player */}
      <motion.div
        className="flex md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md text-white p-3 items-center justify-between rounded-t-2xl shadow-xl z-40 cursor-pointer"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={() => setExpanded(true)}
      >
        {currentTrack && (
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-12 h-12 rounded-lg object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "https://placehold.co/100x100?text=No+Cover";
              }}
            />
            <div className="overflow-hidden">
              <p className="font-semibold truncate">{currentTrack.title}</p>
              <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>
        )}

        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            handlePlayPause();
          }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </motion.button>
      </motion.div>

      {/* 🟢 Mobile Expanded Modal */}
      <AnimatePresence>
        {expanded && currentTrack && (
          <motion.div
            className="md:hidden fixed inset-0 bg-gray-950/95 backdrop-blur-lg text-white z-50 flex flex-col"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4">
              <ChevronDown size={28} onClick={() => setExpanded(false)} className="cursor-pointer" />
              <p className="text-sm text-gray-300">Now Playing</p>
              <div className="w-7" />
            </div>

            {/* Cover */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-72 h-72 rounded-xl shadow-2xl object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://placehold.co/300x300?text=No+Cover";
                }}
              />
            </div>

            {/* Info */}
            <div className="px-6 mt-6">
              <p className="text-2xl font-bold truncate">{currentTrack.title}</p>
              <p className="text-lg text-gray-400 truncate">{currentTrack.artist}</p>
            </div>

            {/* Progress Bar */}
            <div className="px-6 mt-6">
              <input
                type="range"
                min={0}
                max={duration}
                value={position}
                onChange={(e) => onSeekChange(Number(e.target.value))}
                className="w-full h-1 accent-green-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{formatTime(position)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-8 mt-6">
              <motion.button onClick={toggleShuffle} whileHover={{ scale: 1.2 }}>
                <Shuffle size={22} className={shuffle ? "text-green-500" : ""} />
              </motion.button>

              <motion.button onClick={handlePrev} whileHover={{ scale: 1.2 }}>
                <SkipBack size={26} />
              </motion.button>

              <motion.button
                onClick={handlePlayPause}
                className="p-4 rounded-full bg-green-500 hover:bg-green-600 shadow-lg"
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </motion.button>

              <motion.button onClick={handleNext} whileHover={{ scale: 1.2 }}>
                <SkipForward size={26} />
              </motion.button>

              <motion.button onClick={cycleRepeat} whileHover={{ scale: 1.2 }}>
                <Repeat size={22} className={repeat !== "off" ? "text-green-500" : ""} />
              </motion.button>
            </div>

            {/* Volume */}
            <div className="flex items-center justify-center gap-3 px-6 mt-6 mb-8">
              <Volume2 size={20} />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => handleVolume(Number(e.target.value))}
                className="w-40 accent-green-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;
