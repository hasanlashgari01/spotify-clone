// MusicPlayer.tsx
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

// ===== Helpers =====
const formatTime = (sec: number) => {
  if (!isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
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
        className="fixed bottom-4 left-1/2 z-50 hidden w-[95%] -translate-x-1/2 transform items-center justify-between rounded-2xl bg-gray-900/90 p-4 text-white shadow-xl backdrop-blur-md md:flex md:w-4/5"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* Cover + Info */}
        {currentTrack && (
          <div className="flex min-w-[180px] items-center gap-4">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="h-14 w-14 rounded-xl object-cover shadow-md"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://placehold.co/100x100?text=No+Cover';
              }}
            />
            <div className="overflow-hidden">
              <p className="max-w-[120px] truncate font-semibold">
                {currentTrack.title}
              </p>
              <p className="max-w-[120px] truncate text-sm text-gray-400">
                {currentTrack.artist}
              </p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="rounded-full p-2 transition-colors hover:bg-gray-700"
          >
            <SkipBack size={22} />
          </motion.button>

          <motion.button
            onClick={handlePlayPause}
            whileTap={{ scale: 0.85 }}
            className="rounded-full bg-green-500 p-3 shadow-lg transition-colors hover:bg-green-600"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="rounded-full p-2 transition-colors hover:bg-gray-700"
          >
            <SkipForward size={22} />
          </motion.button>
        </div>

        {/* Seek Bar */}
        <div className="flex flex-1 flex-col items-center px-4">
          <input
            type="range"
            min={0}
            max={duration}
            value={position}
            onChange={(e) => onSeekChange(Number(e.target.value))}
            className="h-1 w-[70%] cursor-pointer rounded-lg accent-green-500"
          />
          <div className="mt-1 flex w-full justify-between text-xs text-gray-400">
            <span>{formatTime(position)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Progress Bar Animation */}
          <motion.div
            className="absolute bottom-4 left-0 mt-1 h-1 w-full rounded-full bg-gray-700"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>

        {/* Volume + Options */}
        <div className="flex min-w-[180px] items-center gap-3">
          <motion.button
            onClick={toggleShuffle}
            className={`rounded-full p-2 ${shuffle ? 'bg-green-500/70' : 'hover:bg-gray-700'}`}
            whileHover={{ scale: 1.2 }}
          >
            <Shuffle size={20} />
          </motion.button>

          <motion.button
            onClick={cycleRepeat}
            className={`rounded-full p-2 ${repeat !== 'off' ? 'bg-green-500/70' : 'hover:bg-gray-700'}`}
            whileHover={{ scale: 1.2 }}
          >
            <Repeat size={20} />
          </motion.button>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="rounded-full p-1 transition-colors hover:bg-gray-700"
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={20} />
              ) : (
                <Volume2 size={20} />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => handleVolume(Number(e.target.value))}
              className="h-1 w-16 cursor-pointer rounded-lg accent-green-500"
            />
          </div>

          <motion.button
            onClick={() => setExpanded(!expanded)}
            className="rounded-full p-2 transition-colors hover:bg-gray-700"
            whileHover={{ scale: 1.2 }}
          >
            {expanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </motion.button>
        </div>
      </motion.div>

      {/* 🟢 Mobile Mini Player */}
      <motion.div
        className="fixed right-0 bottom-0 left-0 z-40 flex cursor-pointer items-center justify-between rounded-t-2xl bg-gray-900/90 p-3 text-white shadow-xl backdrop-blur-md md:hidden"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={() => setExpanded(true)}
      >
        {currentTrack && (
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="h-12 w-12 rounded-lg object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://placehold.co/100x100?text=No+Cover';
              }}
            />
            <div className="overflow-hidden">
              <p className="truncate font-semibold">{currentTrack.title}</p>
              <p className="truncate text-sm text-gray-400">
                {currentTrack.artist}
              </p>
            </div>
          </div>
        )}

        <motion.button
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.stopPropagation();
            handlePlayPause();
          }}
          whileTap={{ scale: 0.9 }}
          className="rounded-full bg-green-500 p-2 shadow-lg hover:bg-green-600"
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </motion.button>
      </motion.div>

      {/* 🟢 Mobile Expanded Modal */}
      <AnimatePresence>
        {expanded && currentTrack && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-gray-950/95 text-white backdrop-blur-lg md:hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <ChevronDown
                size={28}
                onClick={() => setExpanded(false)}
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-300">Now Playing</p>
              <div className="w-7" />
            </div>

            {/* Cover */}
            <div className="flex flex-1 items-center justify-center">
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="h-72 w-72 rounded-xl object-cover shadow-2xl"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://placehold.co/300x300?text=No+Cover';
                }}
              />
            </div>

            {/* Info */}
            <div className="mt-6 px-6">
              <p className="truncate text-2xl font-bold">
                {currentTrack.title}
              </p>
              <p className="truncate text-lg text-gray-400">
                {currentTrack.artist}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 px-6">
              <input
                type="range"
                min={0}
                max={duration}
                value={position}
                onChange={(e) => onSeekChange(Number(e.target.value))}
                className="h-1 w-full cursor-pointer accent-green-500"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-400">
                <span>{formatTime(position)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center justify-center gap-8">
              <motion.button
                onClick={toggleShuffle}
                whileHover={{ scale: 1.2 }}
              >
                <Shuffle
                  size={22}
                  className={shuffle ? 'text-green-500' : ''}
                />
              </motion.button>

              <motion.button onClick={handlePrev} whileHover={{ scale: 1.2 }}>
                <SkipBack size={26} />
              </motion.button>

              <motion.button
                onClick={handlePlayPause}
                className="rounded-full bg-green-500 p-4 shadow-lg hover:bg-green-600"
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </motion.button>

              <motion.button onClick={handleNext} whileHover={{ scale: 1.2 }}>
                <SkipForward size={26} />
              </motion.button>

              <motion.button onClick={cycleRepeat} whileHover={{ scale: 1.2 }}>
                <Repeat
                  size={22}
                  className={repeat !== 'off' ? 'text-green-500' : ''}
                />
              </motion.button>
            </div>

            {/* Volume */}
            <div className="mt-6 mb-8 flex items-center justify-center gap-3 px-6">
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
