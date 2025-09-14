import { Link } from 'react-router-dom';
import { Playlist } from '../../services/playlistService';
// import PlaylistActions from './PlaylistActions';
import DeletePlaylistButton from './DeletePlaylistButton';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const PlayListItem: React.FC<Playlist> = ({ id, cover, title, slug, ownerId }) => {
  const [confirm, setConfirm] = useState(false);
  const { user } = useAuth();
  
  // Only show delete functionality if current user is the playlist owner
  const canDelete = user && Number(user.id) === ownerId;
  
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
      {canDelete && (
        <div className="absolute right-1 top-1 hidden sm:block">
          {/* <PlaylistActions onDelete={() => setConfirm(true)} ownerId={ownerId} /> */}
        </div>
      )}
      <Link
        to={`/playlist/${slug}`}
        className="w-full truncate text-center text-xs text-gray-400"
      >
        <h3 className="mt-2 w-full truncate text-center text-sm font-medium text-white sm:text-base">
          {title}
        </h3>
      </Link>
      {canDelete && (
        <div className="mt-2 w-full px-2 sm:hidden">
          <button
            onClick={() => setConfirm(true)}
            className="w-full rounded-lg border border-white/10 px-3 py-1.5 text-center text-xs text-gray-300 hover:bg-white/5"
          >
            Actions
          </button>
        </div>
      )}
      {confirm && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <DeletePlaylistButton
            playlistId={id}
            playlistTitle={title}
            onDeleted={() => setConfirm(false)}
          />
          <button
            onClick={() => setConfirm(false)}
            className="ml-2 rounded-md border border-white/10 px-2 py-1 text-xs text-white/80 hover:bg-white/5"
          >
            بستن
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayListItem;
