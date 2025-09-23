import { SetStateAction, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';
import { IoMdShare } from 'react-icons/io';
import { FaRegHeart } from 'react-icons/fa';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import {
  getPlaylistDetails,
  Playlistinfo,
} from '../../services/playlistDetailsService';
import LoadingCircle from '../loading/LoadingCircle';
import PlaylistStatusControl from './PlaylistStatusControl';
import {
  updatePlaylistStatus,
  PlaylistStatus,
} from '../../services/playlistDetailsService';
import PlaylistMenu from './Playlistmenu';
import { getMe, MeResponse } from '../../services/meService';
type OwnerProp = {
  setOwner: React.Dispatch<SetStateAction<number | null>>;
};
const PlaylistDetails = ({ setOwner }: OwnerProp) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isTablet = useMediaQuery({ minWidth: 767 });

  const { slug } = useParams<{ slug: string }>();
  const [playlist, setPlaylist] = useState<Playlistinfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const [playlistData, userData] = await Promise.all([
          getPlaylistDetails(slug),
          getMe(),
        ]);

        setOwner(playlistData.ownerId);
        setPlaylist(playlistData);
        setMe(userData);
        setIsOwner(userData.sub === playlistData.ownerId);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, setOwner]);

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
      <div className="block md:hidden">
        <div
          className="relative h-[50vh] w-full bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${playlist.cover || '/default.webp'})`,
          }}
        >
          <div className="absolute inset-0 backdrop-blur-[2px]" />

          <div className="relative z-10 flex h-full flex-col items-center justify-between p-8">
            <div className="group relative mt-4">
              <div className="absolute -inset-1 rounded-xl bg-purple-600 opacity-60 blur transition duration-500 group-hover:opacity-80"></div>
              <img
                src={playlist.cover || '/default.webp'}
                alt={playlist.title}
                className="relative h-32 w-32 rounded-xl object-cover shadow-xl ring-1 ring-white/20"
              />
            </div>
            <div className="w-full text-center text-white">
              <h1 className="mt-3 text-2xl font-bold drop-shadow-lg">
                {playlist.title}
              </h1>

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

              <div className="mt-2 flex items-center justify-center gap-2 text-sm opacity-90">
                <img
                  src={playlist.owner.avatar || '/default-avatar.webp'}
                  alt={playlist.owner.fullName}
                  className="h-6 w-6 rounded-full ring-1 ring-white/20"
                />
                <span>{playlist.owner.username}</span>
                <span>•</span>
                <span>{playlist.songs.length} songs</span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4">
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60">
                  <IoMdShare className="text-lg text-white" />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60">
                  <FaRegHeart className="text-lg text-white" />
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <PiDotsThreeOutlineVerticalFill className="text-lg text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:flex md:flex-col md:items-center md:justify-center md:md:justify-start md:p-5">
        <div className="group relative">
          <div className="absolute -inset-1 rounded-2xl bg-purple-600 opacity-75 blur transition duration-1000 group-hover:opacity-100"></div>
          <img
            src={playlist.cover || '/default.webp'}
            alt={playlist.title}
            className="relative h-60 w-60 rounded-2xl object-cover shadow-2xl ring-1 ring-white/10 sm:h-72 sm:w-72 md:h-80 md:w-80"
          />
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 md:gap-8">
          <button className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 sm:h-14 sm:w-14">
            <IoMdShare className="text-2xl text-white transition-colors sm:text-3xl" />
          </button>
          <button className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 sm:h-14 sm:w-14">
            <FaRegHeart className="text-2xl text-white transition-colors group-hover:text-red-400 sm:text-3xl" />
          </button>
          <button
            className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 sm:h-14 sm:w-14"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <PiDotsThreeOutlineVerticalFill className="text-2xl text-white transition-colors sm:text-3xl" />
          </button>
        </div>
      </div>

      <div className="hidden md:-mt-20 md:flex md:flex-col md:items-center md:md:items-start md:justify-center md:gap-3 md:px-5 md:md:text-left md:text-center">
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
      <PlaylistMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        isOwner={isOwner}
        isPublic={playlist.status === 'public'}
        playlist={playlist}
        onPlaylistUpdated={async () => {
          try {
            const fresh = await getPlaylistDetails(playlist.slug);
            setPlaylist(fresh);
          } catch (error) {
            console.error('Error refreshing playlist:', error);
          }
        }}
      />
    </div>
  );
};

export default PlaylistDetails;
