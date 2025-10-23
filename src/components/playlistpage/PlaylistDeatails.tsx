import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';
import { IoMdShare } from 'react-icons/io';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { X, Search } from 'lucide-react';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import {
  getPlaylistDetails,
  Playlistinfo,

} from '../../services/playlistDetailsService';
import PlaylistStatusControl from './PlaylistStatusControl';
import {
  updatePlaylistStatus,
  PlaylistStatus,
} from '../../services/playlistDetailsService';
import PlaylistMenu from './Playlistmenu';
import { getMe, MeResponse } from '../../services/meService';
import { playlistService } from '../../services/playlistService';
import FloatingMusicIcons from './FloatingMusicIcons';
const LuxeLoader = () => (
  <svg
    className="h-20 w-20 animate-[spin_1.8s_ease-in-out_infinite] drop-shadow-[0_0_12px_rgba(59,130,246,0.35)]"
    viewBox="0 0 80 80"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="luxBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5BA1FF" />
        <stop offset="50%" stopColor="#3C78F2" />
        <stop offset="100%" stopColor="#1E3A8A" />
      </linearGradient>
    </defs>
    <circle
      cx="40"
      cy="40"
      r="30"
      stroke="url(#luxBlue)"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
      strokeDasharray="160"
      strokeDashoffset="100"
    />
  </svg>
);
type OwnerProp = {
  setOwner: Dispatch<SetStateAction<number | null>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  setReady?: Dispatch<SetStateAction<boolean>>;
  setPlaylistId?: Dispatch<SetStateAction<number | null>>; // <-- اضافه شده
  onHeartAction?: () => Promise<unknown> | void;
};
const PlaylistDetails = ({
  setOwner,
  search,
  setSearch,
  setReady,
  setPlaylistId, // <-- اضافه شده
}: OwnerProp) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isTablet = useMediaQuery({ minWidth: 767 });

  const { slug } = useParams<{ slug: string }>();
  const [playlist, setPlaylist] = useState<Playlistinfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [, setMe] = useState<MeResponse | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleHeartClick = async () => {
    try {
      if (!playlist?.id || isLiking) return;
      setIsLiking(true);
      const res = await playlistService.LikeorUnlike(`${playlist?.id}`);

      if (res && res.statusCode) {
        console.log('Error Occurred:', res);
        return;
      }
      setIsLiked((prev) => !prev);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  };
  useEffect(() => {
    if (!slug) {
      if (setReady) setReady(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [playlistData, userData] = await Promise.all([
          getPlaylistDetails(slug),
          getMe(),
        ]);

        setOwner(playlistData.ownerId);
        if (setPlaylistId) setPlaylistId(playlistData.id); // <-- فقط همین خط اضافه شد
        setPlaylist(playlistData);
        setIsLiked(playlistData.isLiked);

        setMe(userData);
        setIsOwner(userData.sub === playlistData.ownerId);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        if (setReady) setReady(true);
      }
    };

    fetchData();
  }, [slug, setOwner, setReady, setPlaylistId]); // <-- setPlaylistId هم توی dependency اضافه شد

  if (loading) {
    return (
      <div className="flex min-h-[100vh] w-full items-center justify-center bg-[linear-gradient(180deg,#1574F5_0%,#1453AB_16%,#13458A_35%,#112745_55%,#101721_75%,#101721_100%)]">
        <LuxeLoader />
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
    <div className="relative flex w-full flex-col md:flex-row">
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <FloatingMusicIcons />
      </div>

      <div className="block md:hidden">
        <div
          className="relative h-[50vh] w-full bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${playlist.cover || '/default.webp'})`,
          }}
        >
          <div className="absolute inset-0 backdrop-blur-[2px]" />

          <div className="relative z-10 flex h-full flex-col items-center justify-evenly p-8">
            <div className="group relative mt-4">
              <div className="absolute -inset-1 rounded-xl bg-[#1574f5] opacity-60 blur transition duration-500 group-hover:opacity-80"></div>
              <img
                src={playlist.cover || '/default.webp'}
                alt={playlist.title}
                className="relative h-32 w-32 rounded-xl object-cover shadow-xl ring-1 ring-white/20"
              />
            </div>
            <div className="mb-10 w-full text-center text-white">
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
              <div className="mt-2 flex items-center justify-center gap-2 text-sm opacity-90">

              </div>
              <div className="mt-2 flex w-full items-center justify-center gap-4">
                {!showSearch ? (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowSearch(true)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/60"
                    >
                      <Search className="h-5 w-5 text-white" />
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60">
                      <IoMdShare className="text-lg text-white" />
                    </button>
                    <button
                      onClick={handleHeartClick}
                      disabled={isLiking}
                      aria-disabled={isLiking}
                      className={`group flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60 ${isLiking ? 'cursor-not-allowed opacity-60' : ''}`}
                    >
                      {isLiked ? (
                        <FaHeart className="text-lg text-red-500 transition-colors" />
                      ) : (
                        <FaRegHeart className="text-lg text-white transition-colors group-hover:text-red-400" />
                      )}
                    </button>
                    <button
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60"
                      onClick={() => setMenuOpen(!menuOpen)}
                    >
                      <PiDotsThreeOutlineVerticalFill className="text-lg text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex w-full items-center gap-2 rounded-xl bg-black/40 p-2 backdrop-blur-sm">
                    <input
                      autoFocus
                      type="search"
                      placeholder="Search songs..."
                      className="h-full w-full border-none text-white outline-none"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                      aria-label="Close search"
                      onClick={() => {
                        setShowSearch(false);
                        setSearch('');
                      }}
                      className="group flex h-9 w-11 cursor-pointer items-center justify-center rounded-full bg-red-500/20 ring-1 ring-red-400/30 transition-all duration-200 hover:scale-105 hover:bg-red-500/50 hover:ring-red-400/60"
                    >
                      <X className="h-4 w-4 text-white transition-colors duration-200" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:flex md:flex-col md:items-center md:justify-center md:md:justify-start md:p-5">
        <div className="group relative">
          <div className="absolute -inset-1 rounded-2xl bg-[#1574f5] opacity-75 blur transition duration-1000 group-hover:opacity-100"></div>
          <img
            src={playlist.cover || '/default.webp'}
            alt={playlist.title}
            className="relative h-60 w-60 rounded-2xl object-cover shadow-2xl ring-1 ring-white/10 sm:h-72 sm:w-72 md:h-80 md:w-80"
          />
        </div>

        <div className="relative mt-8 flex items-center justify-between gap-6 md:gap-8">
          <div className="flex items-center gap-6 md:gap-8">
            {!showSearch ? (
              <>
                <button
                  onClick={() => {
                    setShowSearch(true);
                  }}
                  className='className="group sm:w-14" flex h-12 w-14 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 sm:h-14'
                >
                  <Search className="text-white"></Search>
                </button>
                <button className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 sm:h-14 sm:w-14">
                  <IoMdShare className="text-2xl text-white transition-colors sm:text-3xl" />
                </button>
                <button
                  onClick={handleHeartClick}
                  disabled={isLiking}
                  aria-disabled={isLiking}
                  className={`group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 sm:h-14 sm:w-14 ${isLiking ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  {isLiked ? (
                    <FaHeart className="text-2xl text-red-500 transition-colors sm:text-3xl" />
                  ) : (
                    <FaRegHeart className="text-2xl text-white transition-colors group-hover:text-red-400 sm:text-3xl" />
                  )}
                </button>
                <button
                  className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 sm:h-14 sm:w-14"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <PiDotsThreeOutlineVerticalFill className="text-2xl text-white transition-colors sm:text-3xl" />
                </button>
              </>
            ) : (
              <div className="hidden w-full items-center gap-2 rounded-xl bg-white/10 p-2 backdrop-blur-sm md:flex">
                <input
                  type="search"
                  placeholder="Search songs..."
                  className="h-full w-full border-none text-white outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  aria-label="Close search"
                  onClick={() => {
                    setShowSearch(false);
                    setSearch('');
                  }}
                  className="group flex h-9 w-11 cursor-pointer items-center justify-center rounded-full bg-red-500/20 ring-1 ring-red-400/30 transition-all duration-200 hover:scale-105 hover:bg-red-500/50 hover:ring-red-400/60"
                >
                  <X className="h-4 w-4 text-white transition-colors duration-200" />
                </button>
              </div>
            )}
          </div>
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
