import React, { useEffect, useState } from 'react';
import { PlayIcon, PauseIcon } from 'lucide-react';
import { searchService, SearchSong } from '../../services/searchService';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import Skeleton from 'react-loading-skeleton';
type SongsListProps = {
  query: string;
};

const Filltersongslist: React.FC<SongsListProps> = ({ query }) => {
  const [songs, setSongs] = useState<SearchSong[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
  const {
    playSong,
    currentTrack,
    isPlaying: playerIsPlaying,
  } = useMusicPlayer();

  useEffect(() => {
    if (!query) return;
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const res = await searchService.search(query);
        setSongs(res.songs);
      } catch (error) {
        console.error('Error fetching artists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [query]);

  const handlePlayClick = (idx: number) => {
    const song = songs[idx];
    if (!song) return;
    const songForPlayer = {
      id: song.id,
      title: song.title,
      audioUrl: song.audioUrl,
      cover: song.cover,
      duration: song.duration,
      status: song.status || 'active',
      plays: 0,
      artist: {
        id: 0,
        fullName: song.artist.fullName,
        username: song.artist.username,
      },
      artistId: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    playSong(
      songForPlayer,
      songs.map((s) => ({
        id: s.id,
        title: s.title,
        audioUrl: s.audioUrl,
        cover: s.cover,
        duration: s.duration,
        status: s.status || 'active',
        plays: 0,
        artist: {
          id: 0,
          fullName: s.artist.fullName,
          username: s.artist.username,
        },
        artistId: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
    );

    setActive(idx);
  };
if (loading) {
    return (
      <div className="w-full rounded-xl bg-black/40 p-4 md:p-6 lg:p-8">
        <h3 className="mb-3 text-lg font-semibold text-white">Songs</h3>
        <div className="divide-y divide-gray-800">
          <div
            className={`group divide-y divide-gray-800 relative flex flex-col justify-between gap-3 rounded-lg px-2 py-2 transition-all`}
          >
              {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="flex min-w-0 flex-1 items-center gap-3 pb-1 ">
              <Skeleton
                height="40px"
                width="40px"
                borderRadius={12}
                baseColor="#121d31"
                highlightColor="#101721"
              />

              <div className="min-w-0">
                <Skeleton
                  height={12}
                  width={180}
                  baseColor="#121d31"
                  highlightColor="#101721"
                />
                <Skeleton
                  height={12}
                  width={80}
                  baseColor="#121d31"
                  highlightColor="#101721"
                />
              </div>
            </div>
                ))}
          </div>
        </div>
      </div>
    );
  }
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
                  className={`absolute top-1/2 left-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-green-600 text-white transition-all duration-200 md:z-0 md:opacity-0 ${
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
                  <p className="font-bold text-nowrap text-white">{s.title}</p>
                  <p className="truncate text-sm text-gray-300">
                    {s.artist.fullName}
                  </p>
                </div>
              </div>
              <span className="pr-2 text-sm text-white/70 tabular-nums max-sm:opacity-0 md:opacity-100">
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

export default Filltersongslist;
