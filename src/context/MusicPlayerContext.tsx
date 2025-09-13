import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { Song } from '../types/song.type';
import { httpService } from '../config/axios';

// ===== Types =====
export interface Track {
  id: number;
  title: string;
  artist: string;
  cover: string;
  duration: number;
  audioUrl: string;
}

export interface MusicPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playSong: (song: Song, queue?: Song[]) => void;
  pauseTrack: () => void;
  position: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  handlePlayPause: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  onSeekChange: (v: number) => void;
  handleVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
}

// ===== Context =====
const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined
);

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context)
    throw new Error('useMusicPlayer must be used inside MusicPlayerProvider');
  return context;
};

// ===== Provider =====
interface MusicPlayerProviderProps {
  children: ReactNode;
}

interface AudioElement extends HTMLAudioElement {
  __lastAudioObjectUrl: string | undefined;
}

export const MusicPlayerProvider: React.FC<MusicPlayerProviderProps> = ({
  children,
}) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const lastNonZeroVolumeRef = useRef(50);
  const [expanded, setExpanded] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'one' | 'all'>('off');

  // Build base URL for audio if needed
  const baseApiUrl = useMemo(
    () => import.meta.env.VITE_BASE_URL || 'https://spotify-music.liara.run',
    []
  );

  // Single audio element to control playback globally (rendered in DOM)
  const audioRef = useRef<AudioElement>(null);

  // Restore persisted settings on mount
  useEffect(() => {
    try {
      const savedVolume = localStorage.getItem('mp_volume');
      if (savedVolume !== null) {
        const v = Number(savedVolume);
        if (!Number.isNaN(v)) setVolume(Math.max(0, Math.min(100, v)));
      }

      const savedTrack = localStorage.getItem('mp_lastTrack');
      if (savedTrack) {
        const parsed = JSON.parse(savedTrack) as {
          track: Track;
          queue?: Song[];
          position?: number;
        };
        if (parsed && parsed.track) {
          setCurrentTrack(parsed.track);
          if (Array.isArray(parsed.queue)) setQueue(parsed.queue);
          // If audio element exists, preload src and position but do not autoplay
          const audio = audioRef.current;
          if (audio) {
            audio.src = parsed.track.audioUrl;
            if (typeof parsed.position === 'number' && parsed.position > 0) {
              audio.currentTime = parsed.position;
              setPosition(parsed.position);
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Sync volume with element and persist
  useEffect(() => {
    if (audioRef.current) {
      const vol = isMuted ? 0 : Math.min(Math.max(volume / 100, 0), 1);
      audioRef.current.volume = vol;
    }
    try {
      localStorage.setItem('mp_volume', String(volume));
      localStorage.setItem('mp_muted', JSON.stringify(isMuted));
    } catch (error) {
      console.log(error);
    }
  }, [volume, isMuted]);

  // Attach listeners once
  useEffect(() => {
    const audio = audioRef.current!;
    const handleTimeUpdate = () => {
      setPosition(audio.currentTime);
      try {
        if (currentTrack) {
          localStorage.setItem(
            'mp_lastTrack',
            JSON.stringify({
              track: currentTrack,
              queue,
              position: audio.currentTime,
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    const handleLoaded = () =>
      setDuration(isFinite(audio.duration) ? audio.duration : 0);
    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
        return;
      }
      handleNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('ended', handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeat]);

  const resolveAudioUrl = (audioUrl: string) => {
    if (/^https?:\/\//i.test(audioUrl)) return audioUrl;
    return `${baseApiUrl.replace(/\/$/, '')}/${audioUrl.replace(/^\//, '')}`;
  };

  const playSong = async (song: Song, nextQueue?: Song[]) => {
    const mapped: Track = {
      id: song.id,
      title: song.title,
      artist: song.artist.fullName,
      cover: song.cover,
      duration: song.duration || 0,
      audioUrl: resolveAudioUrl(song.audioUrl),
    };

    setCurrentTrack(mapped);
    if (Array.isArray(nextQueue)) setQueue(nextQueue);

    // Persist last track and queue
    try {
      localStorage.setItem(
        'mp_lastTrack',
        JSON.stringify({
          track: mapped,
          queue: Array.isArray(nextQueue) ? nextQueue : queue,
          position: 0,
        })
      );
    } catch (error) {
      console.log(error);
    }
    const audio = audioRef.current!;
    const token = localStorage.getItem('accessToken');

    // If we have a token, fetch with headers and use a blob URL
    const setAndPlay = (src: string) => {
      audio.src = src;
      audio.currentTime = 0;
      setPosition(0);
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    // Keep track of last object URL to revoke it
    const lastObjectUrlRefKey = '__lastAudioObjectUrl' as const;
    const lastUrl = audio[lastObjectUrlRefKey] as string | undefined;
    if (lastUrl) {
      URL.revokeObjectURL(lastUrl);
      audio[lastObjectUrlRefKey] = undefined;
    }

    await httpService(`song/play/${song.id}`);

    if (token) {
      fetch(mapped.audioUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to load audio');
          const blob = await res.blob();
          const objectUrl = URL.createObjectURL(blob);
          (audio as AudioElement)[lastObjectUrlRefKey] = objectUrl;
          setAndPlay(objectUrl);
        })
        .catch(() => {
          // Fallback: try direct URL (for public tracks)
          setAndPlay(mapped.audioUrl);
        });
    } else {
      setAndPlay(mapped.audioUrl);
    }
  };

  const pauseTrack = () => {
    const audio = audioRef.current!;
    audio.pause();
    setIsPlaying(false);
  };
  const handlePlayPause = () => {
    const audio = audioRef.current!;
    if (!currentTrack) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const findCurrentIndex = () => {
    if (!currentTrack) return -1;
    return queue.findIndex((s) => s.id === currentTrack.id);
  };

  const selectNextIndex = () => {
    if (shuffle) {
      if (queue.length === 0) return -1;
      const randomIndex = Math.floor(Math.random() * queue.length);
      return randomIndex;
    }
    const idx = findCurrentIndex();
    if (idx < 0) return -1;
    if (idx === queue.length - 1) {
      return repeat === 'all' ? 0 : -1;
    }
    return idx + 1;
  };

  const selectPrevIndex = () => {
    if (shuffle) {
      if (queue.length === 0) return -1;
      const randomIndex = Math.floor(Math.random() * queue.length);
      return randomIndex;
    }
    const idx = findCurrentIndex();
    if (idx <= 0) {
      return repeat === 'all' ? Math.max(queue.length - 1, -1) : -1;
    }
    return idx - 1;
  };

  const handleNext = () => {
    const nextIndex = selectNextIndex();
    if (nextIndex < 0) {
      // stop
      const audio = audioRef.current!;
      audio.pause();
      setIsPlaying(false);
      return;
    }
    playSong(queue[nextIndex], queue);
  };

  const handlePrev = () => {
    // if user scrubbed more than 3s, just restart current
    const audio = audioRef.current!;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const prevIndex = selectPrevIndex();
    if (prevIndex < 0) {
      audio.currentTime = 0;
      return;
    }
    playSong(queue[prevIndex], queue);
  };

  const onSeekChange = (v: number) => {
    const audio = audioRef.current!;
    audio.currentTime = Math.min(Math.max(v, 0), duration || 0);
    setPosition(audio.currentTime);
    // persist new position with last track
    try {
      if (currentTrack) {
        localStorage.setItem(
          'mp_lastTrack',
          JSON.stringify({
            track: currentTrack,
            queue,
            position: audio.currentTime,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVolume = (v: number) => setVolume(v);
  const toggleMute = () => {
    // Toggle muted state; remember last non-zero volume for restore
    setIsMuted((prev) => {
      const next = !prev;
      if (next === false && volume === 0) {
        // unmuting while slider at 0 -> restore last volume
        const restore = lastNonZeroVolumeRef.current || 50;
        setVolume(restore);
      }
      if (!next && volume > 0) {
        // ensure lastNonZeroVolumeRef holds current
        lastNonZeroVolumeRef.current = volume;
      }
      if (next && volume > 0) {
        lastNonZeroVolumeRef.current = volume;
      }
      return next;
    });
  };

  // Track last non-zero volume
  useEffect(() => {
    if (volume > 0) lastNonZeroVolumeRef.current = volume;
  }, [volume]);
  const toggleShuffle = () => setShuffle((s) => !s);
  const cycleRepeat = () =>
    setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'));

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        (e.target as HTMLElement)?.isContentEditable
      )
        return;
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
        return;
      }
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        onSeekChange(position + 5);
        return;
      }
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onSeekChange(position - 5);
        return;
      }
      if (e.code === 'ArrowUp') {
        e.preventDefault();
        handleVolume(Math.min(100, volume + 5));
        return;
      }
      if (e.code === 'ArrowDown') {
        e.preventDefault();
        handleVolume(Math.max(0, volume - 5));
        return;
      }
      if (e.key.toLowerCase() === 'n') {
        handleNext();
        return;
      }
      if (e.key.toLowerCase() === 'p') {
        handlePrev();
        return;
      }
      if (e.key.toLowerCase() === 'r') {
        cycleRepeat();
        return;
      }
      if (e.key.toLowerCase() === 's') {
        toggleShuffle();
        return;
      }
      if (e.key.toLowerCase() === 'm') {
        toggleMute();
        return;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    handlePlayPause,
    onSeekChange,
    handleNext,
    handlePrev,
    cycleRepeat,
    toggleShuffle,
    position,
    volume,
  ]);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playSong,
        pauseTrack,
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
      }}
    >
      {children}
      {/* Hidden audio element in DOM to comply with autoplay policies and allow OS controls */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </MusicPlayerContext.Provider>
  );
};
