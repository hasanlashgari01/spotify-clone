import { SetStateAction, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';
import {
  getPlaylistDetails,
  Playlistinfo,
} from '../../services/playlistDetailsService';
import EditPlaylistButton from '../Edit playlist details/EditPlaylistButton';
import LoadingCircle from '../loading/LoadingCircle';
import PlaylistStatusControl from './PlaylistStatusControl';
import {
  updatePlaylistStatus,
  PlaylistStatus,
} from '../../services/playlistDetailsService';

type OwnerProp = {
  setOwner: React.Dispatch<SetStateAction<number | null>>;
};
const PlaylistDetails = ({ setOwner }: OwnerProp) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 767, maxWidth: 1500 });

  const { slug } = useParams<{ slug: string }>();
  const [playlist, setPlaylist] = useState<Playlistinfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const data = await getPlaylistDetails(slug);
        setOwner(data.ownerId);
        setPlaylist(data);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center pt-30 text-white">
        <LoadingCircle />
      </div>
    );
  }

  if (!playlist) {
    return <div className="p-5 text-red-500">Playlist not found</div>;
  }

  const totalSeconds = playlist.songs.reduce(
    (acc, s) => acc + s.song.duration,
    0
  );
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="flex w-full flex-col md:flex-row">
      <div className="flex justify-center p-5 md:justify-start">
        <img
          src={playlist.cover || '/default.webp'}
          alt={playlist.title}
          className="h-60 w-60 rounded-2xl object-cover sm:h-72 sm:w-72 md:h-80 md:w-80"
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-3 px-5 text-center md:items-start md:text-left">
        {isMobile && (
          <>
            <span className="mt-2 text-3xl font-bold text-white sm:text-4xl md:text-6xl">
              {playlist.title}
            </span>
            <span className="flex items-center gap-5 text-sm text-white sm:text-base">
              <PlaylistStatusControl
                value={(playlist.status as PlaylistStatus) ?? 'public'}
                ownerId={playlist.ownerId}
                onSelect={async () => {
                  await updatePlaylistStatus(playlist.id);
                  const fresh = await getPlaylistDetails(playlist.slug);
                  setPlaylist(fresh);
                  setOwner(fresh.ownerId);
                }}
              />
              <EditPlaylistButton
                playlist={playlist}
                onUpdated={() => {
                  (async () => {
                    const fresh = await getPlaylistDetails(playlist.slug);
                    setPlaylist(fresh);
                  })();
                }}
              />
            </span>
          </>
        )}
        {isTablet && (
          <>
            <span className="flex items-center gap-5 text-sm text-white sm:text-base">
              <PlaylistStatusControl
                value={(playlist.status as PlaylistStatus) ?? 'public'}
                ownerId={playlist.ownerId}
                onSelect={async () => {
                  await updatePlaylistStatus(playlist.id);
                  const fresh = await getPlaylistDetails(playlist.slug);
                  setPlaylist(fresh);
                  setOwner(fresh.ownerId);
                }}
              />
              <EditPlaylistButton
                playlist={playlist}
                onUpdated={() => {
                  (async () => {
                    const fresh = await getPlaylistDetails(playlist.slug);
                    setPlaylist(fresh);
                  })();
                }}
              />
            </span>
            <span className="mt-2 text-3xl font-bold text-white sm:text-4xl md:text-6xl">
              {playlist.title}
            </span>
          </>
        )}

        <span className="flex flex-wrap justify-center gap-2 text-sm sm:text-base md:mt-5 md:justify-start lg:mt-5">
          <span className="flex items-center gap-1 font-bold text-white">
            <img
              src={playlist.owner.avatar || '/default-avatar.webp'}
              alt={playlist.owner.fullName}
              className="h-8 w-8 rounded-full"
            />
            <span>{playlist.owner.username}</span>
          </span>
          <span className="flex items-center gap-1 text-[#ffffff86]">
            {playlist.songs.length} songs,
          </span>
          <span className="flex items-center gap-1 text-[#ffffff86]">
            {hours > 0 && `${hours} hr `}
            {minutes > 0 && `${minutes} min `}
            {seconds > 0 && `${seconds} sec`}
          </span>
        </span>
      </div>
    </div>
  );
};

export default PlaylistDetails;
