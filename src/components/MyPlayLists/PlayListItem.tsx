import { Link } from 'react-router-dom';
import { Playlist } from '../../services/playlistService';

const PlayListItem: React.FC<Playlist> = ({ cover, title, slug }) => {
  return (
    <div className="group relative flex flex-col items-center overflow-hidden">
      <div className="relative h-[120px] w-[120px] rounded-xl p-[2px] sm:h-[150px] sm:w-[150px] md:h-[210px] md:w-[210px]">
        <div className="h-full w-full overflow-hidden rounded-xl">
          <img
            src={cover || '/default.webp'}
            alt={title}
            className="h-full w-full object-cover transition-all duration-200 group-hover:brightness-90"
          />
        </div>
      </div>{' '}
      <Link
        to={`/playlist/${slug}`}
        className="w-full truncate text-center text-xs text-gray-400"
      >
        <h3 className="mt-2 w-full truncate text-center text-sm font-medium text-white sm:text-base">
          {title}
        </h3>
      </Link>
    </div>
  );
};

export default PlayListItem;
