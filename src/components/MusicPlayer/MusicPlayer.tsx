import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  List,
  Monitor,
  Maximize2,
  Plus,
  Mic2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  duration: number;
}

interface CurrentResponse {
  track: Track;
  isPlaying: boolean;
  position: number;
  duration: number;
}

const API_BASE = 'https://spotify-music.liara.run';

const formatTime = (sec: number): string => {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const MusicPlayer: React.FC = () => {
  const [track, setTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [expanded, setExpanded] = useState(() => {
    const saved = localStorage.getItem('player_expanded');
    return saved === 'true';
  });
  useEffect(() => {
    localStorage.setItem('player_expanded', expanded ? 'true' : 'false');
  }, [expanded]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'one' | 'all'>('off');
  const [isDragging, setIsDragging] = useState(false);
  const dragPosRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTick = useRef<number | null>(null);
  const volumeTimer = useRef<number | null>(null);

  const fetchCurrent = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/current`);
      if (!res.ok) throw new Error('Failed to fetch current track');
      const data: CurrentResponse = await res.json();

      if (data?.track) {
        setTrack(data.track);
        setIsPlaying(data.isPlaying);
        setPosition(clamp(data.position, 0, data.duration));
        setDuration(data.duration || data.track.duration || 0);
      }
    } catch (err) {
      console.error('❌ API Error:', err);
    }
  }, []);

  const sendCommand = useCallback(
    async (cmd: string, body: Record<string, any> = {}) => {
      try {
        await fetch(`${API_BASE}/${cmd}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        fetchCurrent();
      } catch (err) {
        console.error('❌ Command Error:', err);
      }
    },
    [fetchCurrent]
  );

  useEffect(() => {
    fetchCurrent();
    const id = setInterval(fetchCurrent, 3000);
    return () => clearInterval(id);
  }, [fetchCurrent]);

  const tick = useCallback(
    (t: number) => {
      if (!isPlaying || isDragging) {
        lastTick.current = t;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (lastTick.current == null) lastTick.current = t;
      const dt = (t - lastTick.current) / 1000;
      lastTick.current = t;
      setPosition((p) => {
        const next = p + dt;
        return next >= duration ? duration : next;
      });
      rafRef.current = requestAnimationFrame(tick);
    },
    [isPlaying, isDragging, duration]
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((p) => !p);
    sendCommand(isPlaying ? 'pause' : 'play');
  }, [isPlaying, sendCommand]);

  const handleNext = () => sendCommand('next');
  const handlePrev = () => sendCommand('prev');

  const onSeekStart = () => setIsDragging(true);
  const onSeekChange = (v: number) => {
    dragPosRef.current = v;
    setPosition(v);
  };
  const onSeekEnd = () => {
    setIsDragging(false);
    const v = dragPosRef.current ?? position;
    sendCommand('seek', { position: Math.round(v) });
    dragPosRef.current = null;
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    if (volumeTimer.current) window.clearTimeout(volumeTimer.current);
    volumeTimer.current = window.setTimeout(() => {
      sendCommand('volume', { volume: v });
    }, 180);
  };

  const toggleShuffle = () => setShuffle((s) => !s);
  const cycleRepeat = () =>
    setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'));

  const progress = useMemo(
    () => (duration > 0 ? (position / duration) * 100 : 0),
    [position, duration]
  );

  const containerVariants = {
    initial: { y: 80, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 220, damping: 22 },
    },
  };
  const playVariants = { hover: { scale: 1.05 }, tap: { scale: 0.96 } };

  return (
    <AnimatePresence>
      <motion.div
        role="region"
        aria-label="Music Player"
        className="fixed bottom-0 left-0 z-50 w-full text-white"
        initial="initial"
        animate="animate"
        exit="initial"
        variants={containerVariants}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/55 to-black/20 backdrop-blur-md" />

        <div className="pointer-events-auto relative flex flex-col gap-2 border-t border-white/10 px-3 py-2 md:flex-row md:items-center md:justify-between md:gap-3">
          {/* Left: Cover + Title */}
          <div className="flex min-w-0 flex-1 items-center gap-3 md:max-w-[320px]">
            <motion.div
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={
                isPlaying
                  ? { repeat: Infinity, duration: 18, ease: 'linear' }
                  : {}
              }
              className="h-12 w-12 overflow-hidden rounded-md bg-neutral-700/60 ring-1 ring-white/10 sm:h-14 sm:w-14"
            >
              {track ? (
                <img
                  src={track.cover}
                  alt={track.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full animate-pulse bg-neutral-700" />
              )}
            </motion.div>

            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold">
                  {track?.title ?? '—'}
                </p>
                <button
                  title="Add to library"
                  className="inline-flex rounded-md p-1 hover:bg-white/10"
                  aria-label="Add to Library"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="truncate text-xs/5 text-white/70">
                {track?.artist ?? ''}
              </p>
            </div>

            <button
              onClick={() => setExpanded((e) => !e)}
              className="ml-auto inline-flex rounded-md p-1.5 hover:bg-white/10 md:hidden"
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>

          {/* Center: Controls + Seek */}
          <div className="flex w-full max-w-[760px] flex-col items-center md:mx-6">
            <div className="mb-1 flex items-center justify-center gap-4 sm:gap-5">
              <button
                onClick={toggleShuffle}
                className={`inline-flex rounded-md p-1.5 hover:bg-white/10 ${shuffle ? 'text-white' : 'text-white/70'}`}
                aria-pressed={shuffle}
                title="Shuffle"
              >
                <Shuffle size={18} />
              </button>

              <button
                onClick={handlePrev}
                className="rounded-md p-1.5 text-white/80 hover:bg-white/10"
                aria-label="Previous"
              >
                <SkipBack size={20} />
              </button>

              <motion.button
                onClick={handlePlayPause}
                className="rounded-full bg-white p-2 text-black shadow-lg shadow-black/30 sm:p-3"
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                whileHover="hover"
                whileTap="tap"
                variants={playVariants}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </motion.button>

              <button
                onClick={handleNext}
                className="rounded-md p-1.5 text-white/80 hover:bg-white/10"
                aria-label="Next"
              >
                <SkipForward size={20} />
              </button>

              <button
                onClick={cycleRepeat}
                className={`inline-flex rounded-md p-1.5 hover:bg-white/10 ${repeat !== 'off' ? 'text-white' : 'text-white/70'}`}
                aria-label="Repeat"
                title={`Repeat: ${repeat}`}
              >
                <Repeat size={18} />
              </button>
            </div>

            {/* Seek */}
            <div className="flex w-full items-center gap-2 select-none">
              <span className="hidden w-10 shrink-0 text-right text-[11px] text-white/70 sm:block">
                {formatTime(position)}
              </span>
              <div className="relative w-full">
                <div className="absolute inset-0 rounded-full bg-white/10" />
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full bg-white/80"
                  style={{ width: `${progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}
                />
                <input
                  type="range"
                  min={0}
                  max={Math.max(1, Math.floor(duration))}
                  value={Math.floor(position)}
                  onMouseDown={onSeekStart}
                  onTouchStart={onSeekStart}
                  onChange={(e) => onSeekChange(Number(e.target.value))}
                  onMouseUp={onSeekEnd}
                  onTouchEnd={onSeekEnd}
                  className="relative z-10 block w-full cursor-pointer appearance-none bg-transparent outline-none [--h:6px] [--thumb:14px]"
                  aria-label="Seek"
                />
              </div>
              <span className="hidden w-10 shrink-0 text-[11px] text-white/70 sm:block">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: Tools + Volume (always visible on md+, moved to mobile panel too) */}
          <div className="hidden w-[260px] items-center justify-end gap-3 md:flex">
            <button
              className="rounded-md p-1.5 text-white/70 hover:bg-white/10"
              title="Connect to a device"
              aria-label="Devices"
            >
              <Monitor size={16} />
            </button>
            <button
              className="rounded-md p-1.5 text-white/70 hover:bg-white/10"
              title="Enable microphone"
              aria-label="Mic"
            >
              <Mic2 size={16} />
            </button>
            <button
              className="rounded-md p-1.5 text-white/70 hover:bg-white/10"
              title="Queue"
              aria-label="Queue"
            >
              <List size={16} />
            </button>
            <div className="flex items-center gap-2">
              <Volume2 size={16} className="text-white/80" />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => handleVolume(Number(e.target.value))}
                className="w-28 cursor-pointer appearance-none bg-transparent [--h:6px] [--thumb:12px]"
                aria-label="Volume"
              />
            </div>
            <button
              className="rounded-md p-1.5 text-white/70 hover:bg-white/10"
              title="Fullscreen"
              aria-label="Fullscreen"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>

        {/* Mobile: Expandable Panel */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="mobile-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="border-t border-white/10 bg-black/60 px-3 pt-2 pb-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 md:hidden">
                <button
                  onClick={toggleShuffle}
                  className={`rounded-md p-2 ${shuffle ? 'bg-white/15' : 'bg-white/5'}`}
                >
                  <Shuffle size={18} />
                </button>
                <button
                  onClick={cycleRepeat}
                  className={`rounded-md p-2 ${repeat !== 'off' ? 'bg-white/15' : 'bg-white/5'}`}
                >
                  <Repeat size={18} />
                </button>
                <button className="rounded-md bg-white/5 p-2">
                  <Monitor size={18} />
                </button>
                <button className="rounded-md bg-white/5 p-2">
                  <Mic2 size={18} />
                </button>
                <button className="rounded-md bg-white/5 p-2">
                  <List size={18} />
                </button>
                <div className="flex items-center gap-2">
                  <Volume2 size={18} className="text-white/80" />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => handleVolume(Number(e.target.value))}
                    className="w-28 appearance-none bg-transparent [--h:6px] [--thumb:12px]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default MusicPlayer;
