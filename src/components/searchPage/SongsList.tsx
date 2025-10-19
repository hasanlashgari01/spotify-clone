import React, { useEffect, useState } from 'react';
import { PlayIcon, PauseIcon } from 'lucide-react';
import { searchService, SearchSong } from '../../services/searchService';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

type SongsListProps = {
  query: string;
};

const SongsList: React.FC<SongsListProps> = ({ query }) => {
  const [songs, setSongs] = useState<SearchSong[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { playSong, currentTrack, isPlaying: playerIsPlaying } = useMusicPlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      if (!query) return;
      const res = await searchService.search(query);
     setSongs(res.songs.slice(0, 4));
    };
    fetchSongs();
  }, [query]);

  const handlePlayClick = (idx: number) => {
    const song = songs[idx];
    if (!song) return;
    
    // Convert SearchSong to Song format for the music player
    const songForPlayer = {
      id: song.id,
      title: song.title,
      audioUrl: song.audioUrl,
      cover: song.cover,
      duration: song.duration,
      artist: {
        fullName: song.artist.fullName,
        username: song.artist.username
      }
    };
    
    // Play the song and set the queue to all songs
    playSong(songForPlayer, songs.map(s => ({
      id: s.id,
      title: s.title,
      audioUrl: s.audioUrl,
      cover: s.cover,
      duration: s.duration,
      artist: {
        fullName: s.artist.fullName,
        username: s.artist.username
      }
    })));
    
    setActive(idx);
    setIsPlaying(true);
  };

  if (songs.length === 0) return null;

  return (
    <div className="w-full rounded-xl bg-black/40 p-4 md:p-6 lg:p-8">
      <h3 className="mb-3 text-lg font-semibold text-white">Songs</h3>
      <div className="divide-y divide-gray-800">
        {songs.map((s, i) => {
          const isActive = active === i;
          const isHovered = hovered === i;
          return (
            <div
              key={s.id}
              className={`group relative flex items-center justify-between gap-4 rounded-lg px-2 py-2 transition-all ${
                isHovered || isActive ? 'bg-gray-800/80' : 'bg-transparent'
              }`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="relative w-6 flex-shrink-0">
                <span
                  className={`block text-center text-white transition-opacity ${
                    isHovered ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  {i + 1}
                </span>
                <div
                  onClick={() => handlePlayClick(i)}
                  className={`absolute md:z-0 md:opacity-0 top-1/2 left-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-green-600 text-white transition-all duration-200 ${
                    isHovered ? 'md:z-10 md:opacity-100' : ''
                  }`}
                >
                  {isActive && currentTrack?.id === s.id && playerIsPlaying ? (
                    <PauseIcon size={14} />
                  ) : (
                    <PlayIcon size={14} />
                  )}
                </div>
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <img
                  src={s.cover}
                  alt={s.title}
                  className="h-10 w-10 rounded-lg object-cover shadow"
                />
                <div className="min-w-0">
                  <p className="text-nowrap font-bold text-white">{s.title}</p>
                  <p className="truncate text-sm text-gray-300">{s.artist.fullName}</p>
                </div>
              </div>
              <span className="pr-2 text-sm text-white/70 tabular-nums  max-sm:opacity-0 md:opacity-100">
                {Math.floor(s.duration / 60)}:
                {String(s.duration % 60).padStart(2, '0')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SongsList;
