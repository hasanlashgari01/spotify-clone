import React, { useState, useEffect, SetStateAction } from 'react';
import { PlaylistSong, SongSortBy, SortOrder } from '../../services/playlistDetailsService';


import { useMusicPlayer } from '../../context/MusicPlayerContext';
import SortMenu from './SortMenu';
import { useMediaQuery } from 'react-responsive';
import LoadingCircle from '../loading/LoadingCircle';
import { PlayIcon , PauseIcon} from 'lucide-react'
interface PlSongsProps {
  songs: PlaylistSong[];
  setSortBy: React.Dispatch<SetStateAction<SongSortBy>>;
  setOrder: React.Dispatch<SetStateAction<SortOrder>>;
  sortBy: SongSortBy;
  order: SortOrder;
  isOwner : boolean | null
  deleteMusic: (songId: number) => void;
  deletingId: number | null;
}

const PlSongs: React.FC<PlSongsProps> = ({
  songs,
  setSortBy,
  setOrder,
  sortBy,
  order,
  deleteMusic,
  isOwner,
  deletingId,
}) => {
  const { currentTrack, isPlaying, playSong, handlePlayPause } = useMusicPlayer();
  const [Album, setAlbum] = useState(true);
  const [DateAdded, setDateAdded] = useState(true);
  const [HoveredRow, setHoveredRow] = useState<number | null>(null);
  const isTablet = useMediaQuery({ maxWidth: 1280 });

  const handlePlayClick = (ts: PlaylistSong, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isActive = currentTrack?.id === ts.song.id;

    if (isActive) {
      handlePlayPause();
    } else {
      playSong(ts.song);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 780) {
        setAlbum(false);
        setDateAdded(false);
      } else {
        setAlbum(true);
        setDateAdded(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full overflow-hidden text-left">
          <thead className="text-white">
            <tr>
              <th className="h-5 w-6 sm:w-8">
                <h6 className="text-center">#</h6>
              </th>
              <th className="pl-2 w-[60vw] text-start sm:w-[50vw] md:w-[40vw] lg:w-[38vw] xl:w-[36vw]">
                Title
              </th>
              {Album && (
                <th className="hidden md:table-cell pl-3 md:w-[16vw] lg:w-[14vw]">Status</th>
              )}
              {DateAdded && (
                <th className="hidden sm:table-cell pl-3 md:w-[18vw] lg:w-[16vw]">Date added</th>
              )}
              {DateAdded && (
                <th className="hidden md:table-cell pl-2">Duration</th>
              )}
              <th className="w-[1%] pr-2 pl-2 text-right sm:pr-4">
                <SortMenu
                  sortBy={sortBy}
                  order={order}
                  onChange={(s, o) => {
                    setSortBy(s);
                    setOrder(o);
                  }}
                />
              </th>
            </tr>
          </thead>

          <tbody>
            {songs.map((ts, i) => {
              const isActive = currentTrack?.id === ts.song.id;
              return (
                <tr
                  key={i}
                  className="song-tableRow border-b border-gray-700 transition hover:bg-gray-800/40"
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="relative w-6 py-2 text-center sm:w-8 sm:py-3">
                    <span
                      style={{ color: 'white' }}
                      className={HoveredRow === i ? '-z-10 opacity-0' : 'z-10 opacity-100'}
                    >
                      {i + 1}
                    </span>
                    <div
                      onClick={(e) => handlePlayClick(ts, e)}
                      className={`playBTN absolute top-1/2 left-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full text-white bg-green-600 p-1 sm:h-5 sm:w-5 ${
                        HoveredRow === i || isTablet ? 'z-10 opacity-100' : '-z-10 opacity-0'
                      }`}
                    >
                      {isActive && isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </div>
                  </td>

                  {/* Title */}
                  <td className="py-2 sm:py-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <img
                        src={ts.song.cover}
                        className="h-10 w-10 flex-shrink-0 rounded-lg sm:h-12 sm:w-12"
                        alt={ts.song.title}
                      />
                      <div className="flex min-w-0 flex-col items-start justify-center">
                        <h3
                          className="font-md text-start font-bold text-white max-w-[60vw] truncate sm:max-w-[50vw] md:max-w-[40vw] lg:max-w-[36vw]"
                          title={ts.song.title}
                        >
                          {ts.song.title}
                        </h3>
                        <h4
                          className="max-w-[50vw] truncate text-xs text-white/80 sm:max-w-[40vw] sm:text-sm md:max-w-[32vw] lg:max-w-[28vw]"
                          title={ts.song.artist.fullName}
                        >
                          {ts.song.artist.fullName}
                        </h4>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  {Album && (
                    <td className="hidden md:table-cell">
                      <h6
                        className={
                          ts.song.status === 'PUBLISHED' ? 'text-green-500' : 'text-red-600'
                        }
                      >
                        {ts.song.status}
                      </h6>
                    </td>
                  )}

                  {/* Date added */}
                  {DateAdded && (
                    <td className="hidden text-white sm:table-cell">
                      {ts.song.createdAt.split('T')[0]}
                    </td>
                  )}

                  {/* Duration */}
                  {DateAdded && (
                    <td className="pl-2 text-right text-white md:text-left">
                      {Math.floor(ts.song.duration / 60)}:
                      {String(ts.song.duration % 60).padStart(2, '0')}
                    </td>
                  )}

                  {/* Delete Button */}
                  <td>
                    {isOwner && <div className="flex justify-center">
                      {deletingId === ts.song.id ? (
                        <LoadingCircle />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => deleteMusic(ts.song.id)}
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="h-6 w-6 cursor-pointer text-gray-400 transition-all hover:text-white"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                          <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                        </svg>
                      )}
                    </div>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlSongs;
