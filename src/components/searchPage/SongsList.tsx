import React, { useState } from 'react';
import { PlayIcon, PauseIcon } from 'lucide-react';

type Song = {
  id: string;
  title: string;
  artist: string;
  duration: number;
  cover: string;
};

const songs: Song[] = [
  {
    id: '1',
    title: 'Timar',
    artist: 'Amir Tataloo',
    duration: 236,
    cover: '/default.webp',
  },
  {
    id: '2',
    title: 'Timar',
    artist: 'Mohsen Ebrahimzadeh',
    duration: 186,
    cover: '/default.webp',
  },
  {
    id: '3',
    title: 'Timarhane',
    artist: 'CeG',
    duration: 230,
    cover: '/default.webp',
  },
  {
    id: '4',
    title: 'VENDETTA',
    artist: 'Timar',
    duration: 150,
    cover: '/default.webp',
  },
];

const SongsList: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = (idx: number) => {
    if (active === idx) {
      setIsPlaying((val) => !val);
    } else {
      setActive(idx);
      setIsPlaying(true);
    }
  };

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
                  {isActive && isPlaying ? (
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
                  <p className="truncate text-sm text-gray-300">{s.artist}</p>
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
