import FloatingMusicIcons from '../../components/playlistpage/FloatingMusicIcons';
import PlaylistMenu from '../../components/playlistpage/Playlistmenu';
import { Search, X } from 'lucide-react';
import { FC } from 'react';
import { IoMdShare } from 'react-icons/io';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import { GenreDetailsWrapperProps } from '../../types/song.type';

const GenreDetailsWrapper: FC<GenreDetailsWrapperProps> = ({
  genreDetails,
  songs,
  hours,
  minutes,
  seconds,
  isOwner,
  menuOpen,
  setMenuOpen,
  showSearch,
  setShowSearch,
  setSearch,
  search,
}) => {
  if (!genreDetails) {
    return <div className="p-4 text-center">Loading genre details...</div>;
  }

  return (
    <div className="relative flex w-full flex-col md:flex-row">
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <FloatingMusicIcons />
      </div>

      <div className="block md:hidden">
        <div
          className="relative h-[50vh] w-full bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${genreDetails.cover || '/default.webp'})`,
          }}
        >
          <div className="absolute inset-0 backdrop-blur-[2px]" />

          <div className="relative z-10 flex h-full flex-col items-center justify-evenly p-8">
            <div className="group relative mt-4">
              <div className="absolute -inset-1 rounded-xl bg-[#1574f5] opacity-60 blur transition duration-500 group-hover:opacity-80"></div>
              <img
                src={genreDetails.cover || '/default.webp'}
                alt={genreDetails.title}
                className="relative h-32 w-32 rounded-xl object-cover shadow-xl ring-1 ring-white/20"
              />
            </div>
            <div className="mb-10 w-full text-center text-white">
              <div className="flex flex-col">
                <div className="flex justify-center">
                  <span className="mx-1 my-3 text-2xl font-bold drop-shadow-lg">
                    {genreDetails.title}
                  </span>
                  <span className="mx-1 my-2 text-2xl">.</span>
                  <h4 className="mt-4">{songs.length} songs</h4>
                </div>
                <span className="items-center gap-1 text-[#ffffff86]">
                  {hours > 0 && `${hours} hr `}
                  {minutes > 0 && `${minutes} min `}
                  {seconds > 0 && `${seconds} sec`}
                </span>
              </div>
              <div className="relative top-5 flex w-full items-center justify-center gap-4">
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

      {/* Modified desktop mode start */}
      <div className="hidden md:flex md:flex-col md:items-start md:gap-6 md:p-5">
        <div className="flex md:flex-row md:items-center md:gap-8">
          <div className="group relative">
            <div className="absolute -inset-1 rounded-2xl bg-[#1574f5] opacity-75 blur transition duration-1000 group-hover:opacity-100"></div>
            <img
              src={genreDetails.cover || '/default.webp'}
              alt={genreDetails.title}
              className="relative h-60 w-60 rounded-2xl object-cover shadow-2xl ring-1 ring-white/10 sm:h-72 sm:w-72 md:h-80 md:w-80"
            />
          </div>

          <div className="flex flex-col justify-center gap-3 md:text-left md:text-white">
            <div className="text-2xl font-bold">{genreDetails.title} Genre</div>
            <div>{songs.length} songs</div>
            <div className="text-[#ffffff86]">
              {hours > 0 && `${hours} hr `}
              {minutes > 0 && `${minutes} min `}
              {seconds > 0 && `${seconds} sec`}
            </div>
          </div>
        </div>

        <div className="mt-4 ml-10 flex items-center gap-6">
          {!showSearch ? (
            <>
              <button
                onClick={() => setShowSearch(true)}
                className="group flex h-12 w-14 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 sm:h-14"
              >
                <Search className="text-white" />
              </button>
              <button className="group flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 sm:h-14 sm:w-14">
                <IoMdShare className="text-2xl text-white transition-colors sm:text-3xl" />
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

      <PlaylistMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        isOwner={isOwner}
        playlist={genreDetails}
      />
    </div>
  );
};

export default GenreDetailsWrapper;
