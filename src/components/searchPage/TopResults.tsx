import React, { useState } from 'react';
import { PlayIcon, PauseIcon } from 'lucide-react';

type TopResultProps = {
  title?: string;
  artist?: string;
  cover?: string;
  onClick?: () => void;
};

const TopResults: React.FC<TopResultProps> = ({
  title = 'Nagoo Na',
  artist = 'Amir Tataloo',
  cover = '/tataloo.webp',
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying((p) => !p);
    if (onClick) onClick();
  };

  return (
    <div
      className={`relative flex items-center gap-5 rounded-2xl bg-gradient-to-br from-black/80 to-gray-900/80 p-6 shadow-lg transition-all md:h-86 md:p-8 ${hovered ? 'ring-1 ring-[#00c754]/40 ring-offset-2 ring-offset-transparent' : ''} `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">
        <img
          src={cover}
          alt={title}
          className="h-20 w-20 rounded-lg object-cover shadow-xl md:h-64 md:w-64"
        />
        <button
          onClick={handlePlayClick}
          className={`absolute top-1/2 left-1/2 flex h-20 w-20 translate-x-120 translate-y-10 items-center justify-center rounded-full bg-green-600 text-white shadow transition-all duration-150 ${
            hovered
              ? 'scale-100 opacity-100'
              : 'pointer-events-none scale-90 opacity-0'
          }`}
        >
          {isPlaying ? <PauseIcon size={38} /> : <PlayIcon size={38} />}
        </button>
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-2xl leading-tight font-bold text-white md:text-3xl">
          Nagoo Na
        </div>
        <div className="truncate text-lg text-gray-300 md:text-xl">
          {artist}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded bg-neutral-900/80 px-2 py-1 text-xs text-gray-500">
            Song
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopResults;
