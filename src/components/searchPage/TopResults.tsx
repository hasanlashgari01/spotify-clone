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
  setIsPlaying((prev) => !prev); // مهم: استفاده از prev برای toggle
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
          className="h-24 w-24 rounded-lg object-cover shadow-xl sm:h-36 sm:w-36 md:h-52 md:w-52 lg:h-64 lg:w-64"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-base leading-tight font-bold text-nowrap text-white sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
          Nagoo Na
        </div>
        <div className="text-sm text-nowrap text-gray-300 sm:text-base md:text-lg lg:text-xl">
          {artist}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded bg-neutral-900/80 px-2 py-1 text-[10px] text-gray-500 sm:text-xs md:text-sm">
            Song
          </span>
        </div>
      </div>
<button
  onClick={handlePlayClick}
  className={`relative flex items-center justify-center rounded-full bg-green-600 text-white shadow transition-all duration-150
    -bottom-7 h-10 w-10 opacity-100 scale-100 pointer-events-auto
    sm:-bottom-7 sm:h-12 sm:w-12
    md:-bottom-23 md:h-16 md:w-16 md:opacity-0 md:scale-90 md:pointer-events-auto
    lg:h-20 lg:w-20
    ${hovered ? 'md:opacity-100 md:scale-100 md:pointer-events-auto' : ''}
  `}
>
  {isPlaying ? (
    <PauseIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10" />
  ) : (
    <PlayIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10" />
  )}
</button>

    </div>
  );
};

export default TopResults;
