import React, { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon } from 'lucide-react';
import { searchService, SearchSong } from '../../services/searchService';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import Skeleton from 'react-loading-skeleton';
type TopResultProps = {
  query: string;
};

const TopResults: React.FC<TopResultProps> = ({ query }) => {
  const [hovered, setHovered] = useState(false);
  const [topSong, setTopSong] = useState<SearchSong | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    playSong,
    currentTrack,
    isPlaying: playerIsPlaying,
  } = useMusicPlayer();

  useEffect(() => {
    if (!query) return;
    const fetchTopres = async () => {
      try {
        setLoading(true);
        const res = await searchService.search(query);
        setTopSong(res.songs[0]);
      } catch (error) {
        console.error('Error fetching artists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopres();
  }, [query]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!topSong) return;
    const songForPlayer = {
      id: topSong.id,
      title: topSong.title,
      audioUrl: topSong.audioUrl,
      cover: topSong.cover,
      duration: topSong.duration,
      status: topSong.status || 'active',
      plays: 0,
      artist: {
        id: 0,
        fullName: topSong.artist.fullName,
        username: topSong.artist.username,
      },
      artistId: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Play the song
    playSong(songForPlayer);
  };
  if (loading) {
    return (
      <div
        className={`relative flex items-center gap-5 rounded-2xl bg-gradient-to-br from-black/80 to-gray-900/80 p-6 shadow-lg transition-all md:h-86 md:p-8`}
      >
        <div className="relative">
          <div className="h-24 w-24 rounded-lg object-cover shadow-xl sm:h-36 sm:w-36 md:h-52 md:w-52 lg:h-64 lg:w-64">
            <Skeleton
              height="100%"
              width="100%"
              borderRadius={12}
              baseColor="#121d31"
              highlightColor="#101721"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="-nowrap text-base leading-tight font-bold text-nowrap text-white sm:text-lg md:text-sm lg:text-2xl xl:text-3xl">
            <Skeleton
              height="100%"
              width="50%"
              baseColor="#121d31"
              highlightColor="#101721"
            />
          </div>
          <div className="mt-2 text-sm text-nowrap text-gray-300 sm:text-base md:text-sm lg:text-xl">
            <Skeleton
              height={16}
              width="30%"
              baseColor="#121d31"
              highlightColor="#101721"
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Skeleton
              height={20}
              width={50}
              baseColor="#121d31"
              highlightColor="#101721"
            />
          </div>
        </div>
      </div>
    );
  }
  if (!topSong) return null;

  return (
    <div
      className={`relative flex items-center gap-5 rounded-2xl bg-gradient-to-br from-black/80 to-gray-900/80 p-6 shadow-lg transition-all md:h-86 md:p-8 ${
        hovered
          ? 'ring-1 ring-[#00c754]/40 ring-offset-2 ring-offset-transparent'
          : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">
        <img
          src={topSong.cover}
          alt={topSong.title}
          className="h-24 w-24 rounded-lg object-cover shadow-xl sm:h-36 sm:w-36 md:h-52 md:w-52 lg:h-64 lg:w-64"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="-nowrap text-base leading-tight font-bold text-nowrap text-white sm:text-lg md:text-sm lg:text-2xl xl:text-3xl">
          {topSong.title.length > 15
            ? topSong.title.slice(0, 15) + '...'
            : topSong.title}
        </div>
        <div className="text-sm text-nowrap text-gray-300 sm:text-base md:text-sm lg:text-xl">
          {topSong.artist.fullName}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded bg-neutral-900/80 px-2 py-1 text-[10px] text-gray-500 sm:text-xs md:text-sm">
            Song
          </span>
        </div>
      </div>

      <button
        onClick={handlePlayClick}
        className={`pointer-events-auto relative -bottom-7 flex h-10 w-10 scale-100 cursor-pointer items-center justify-center rounded-full bg-green-600 text-white opacity-100 shadow transition-all duration-150 sm:-bottom-7 sm:h-12 sm:w-12 md:pointer-events-auto md:-bottom-23 md:h-16 md:w-16 md:scale-90 md:opacity-0 lg:h-20 lg:w-20 ${hovered ? 'md:pointer-events-auto md:scale-100 md:opacity-100' : ''} `}
      >
        {currentTrack?.id === topSong.id && playerIsPlaying ? (
          <PauseIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10" />
        ) : (
          <PlayIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10" />
        )}
      </button>
    </div>
  );
};

export default TopResults;
