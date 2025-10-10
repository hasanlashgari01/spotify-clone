import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Song } from '../../types/song.type';
import PauseIcon from '../icons/PauseIcon';
import PlayIcon from '../icons/PlayIcon';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

const SongItem: React.FC<Song> = ({ id, cover, title, artist, ...rest }) => {
  const { currentTrack, isPlaying, playSong, handlePlayPause } =
    useMusicPlayer();

  const isActive = useMemo(
    () => currentTrack?.id === id,
    [currentTrack?.id, id]
  );

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isActive) {
      handlePlayPause();
    } else {
      // Attempt to find a parent list providing the queue via DOM dataset; fallback to single
      // You can enhance this by lifting queue into context where lists render
      playSong({ id, cover, title, artist, ...rest } as Song);
    }
  };

  return (
    <div className="group relative flex h-full w-full flex-col items-center overflow-hidden">
      <div className="relative h-[120px] w-[120px] rounded-xl bg-gradient-to-b from-[#1574f5] to-transparent p-[2px] sm:h-[150px] sm:w-[150px] md:h-[170px] md:w-[170px]">
        <div className="h-full w-full overflow-hidden rounded-xl">
          <img
            src={cover}
            alt={title}
            className="h-full w-full object-cover transition-all duration-200 group-hover:brightness-90"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://placehold.co/300x300?text=No+Cover';
            }}
          />
        </div>

        {/* آیکون play/pause در سمت راست پایین */}
        <div className="absolute right-2 bottom-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB954] p-2 transition-transform hover:scale-105"
            onClick={handlePlayClick}
          >
            {isActive && isPlaying ? <PauseIcon /> : <PlayIcon />}
          </div>
        </div>
      </div>
      {/* عنوان آهنگ */}
      <h3 className="mt-2 w-full truncate text-center text-sm font-medium text-white sm:text-base">
        {title}
      </h3>
      {/* نام آرتیست */}
      <Link
        to={`/profile/${artist.username}`}
        className="mt-1 w-full truncate text-center text-xs text-gray-400"
      >
        {artist.fullName}
      </Link>
      {/* هاور کارت: افکت روشن‌تر با opacity کمتر */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>{' '}
      {/* تغییر از 50 به 20 */}
    </div>
  );
};

export default SongItem;
