import React, { useState, useEffect, SetStateAction } from 'react';
import {
  PlaylistSong,
  SongSortBy,
  SortOrder,
} from '../../services/playlistDetailsService';

import { useMusicPlayer } from '../../context/MusicPlayerContext';
import SortMenu from './SortMenu';
import { useMediaQuery } from 'react-responsive';
import LoadingCircle from '../loading/LoadingCircle';
import { PlayIcon, PauseIcon } from 'lucide-react';
import '../../styles/scrollbar-hide.css';

interface PlSongsProps {
  songs: PlaylistSong[];
  setSortBy: React.Dispatch<SetStateAction<SongSortBy>>;
  setOrder: React.Dispatch<SetStateAction<SortOrder>>;
  sortBy: SongSortBy;
  order: SortOrder;
  isOwner: boolean | null;
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
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const handlePlayClick = (ts: PlaylistSong, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isActive = currentTrack?.id === ts.song.id;

    if (isActive) handlePlayPause();
    else playSong(ts.song);
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
    <div className="w-full border-b-1">
      <div
        className={`w-full overflow-x-auto ${
          songs.length > 8
            ? 'scrollbar-hide relative max-h-[55vh] overflow-y-auto md:max-h-[65vh] lg:max-h-[70vh]'
            : ''
        }`}
      >
        <table className="min-w-full text-left">
          <thead className="sticky top-0 z-10 text-white backdrop-blur-sm">
            <tr>
              <th className="h-5 w-6 sm:w-8">
                <h6 className="text-center text-[0.85rem] sm:text-[0.9rem] font-normal">#</h6>
              </th>
              <th className="w-[60vw] pl-2 text-start sm:w-[50vw] md:w-[40vw] lg:w-[38vw] xl:w-[36vw] text-[0.9rem] sm:text-[1rem] font-normal">
                Title
              </th>
              {Album && (
                <th className="hidden pl-3 md:table-cell md:w-[16vw] lg:w-[14vw] text-[0.9rem] font-normal">
                  Status
                </th>
              )}
              {DateAdded && (
                <th className="hidden pl-3 sm:table-cell md:w-[18vw] lg:w-[16vw] text-[0.9rem] font-normal">
                  Date added
                </th>
              )}
              {DateAdded && (
                <th className="hidden pl-3 md:table-cell">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="white"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342z" />
                    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
                    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
                  </svg>
                </th>
              )}
              <th className="w-[1%] pr-2 pl-2 text-right sm:pr-4">
                {!isMobile && (
                  <SortMenu
                    sortBy={sortBy}
                    order={order}
                    onChange={(s, o) => {
                      setSortBy(s);
                      setOrder(o);
                    }}
                  />
                )}
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
                      className={
                        HoveredRow === i ? '-z-10 opacity-0' : 'z-10 opacity-100'
                      }
                    >
                      {i + 1}
                    </span>
                    <div
                      onClick={(e) => handlePlayClick(ts, e)}
                      className={`playBTN absolute top-1/2 left-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-green-600 p-1 text-white sm:h-5 sm:w-5 ${
                        HoveredRow === i || isTablet
                          ? 'z-1 opacity-100'
                          : '-z-10 opacity-0'
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
                          className="max-w-[60vw] truncate text-start text-white text-[0.9rem] sm:text-[0.95rem] md:text-[1rem] font-normal sm:max-w-[50vw] md:max-w-[40vw] lg:max-w-[36vw]"
                          title={ts.song.title}
                        >
                          {ts.song.title}
                        </h3>
                        <h4
                          className="max-w-[50vw] truncate text-xs sm:text-[0.8rem] md:text-[0.85rem] text-white/70 sm:max-w-[40vw] md:max-w-[32vw] lg:max-w-[28vw]"
                          title={ts.song.artist.fullName}
                        >
                          {ts.song.artist.fullName}
                        </h4>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  {Album && (
                    <td className="hidden md:table-cell text-[0.85rem] md:text-[0.9rem]">
                      <h6
                        className={
                          ts.song.status === 'PUBLISHED'
                            ? 'text-green-500'
                            : 'text-red-600'
                        }
                      >
                        {ts.song.status}
                      </h6>
                    </td>
                  )}

                  {/* Date added */}
                  {DateAdded && (
                    <td className="hidden text-white sm:table-cell text-[0.8rem] sm:text-[0.85rem] md:text-[0.9rem]">
                      {ts.song.createdAt.split('T')[0]}
                    </td>
                  )}

                  {/* Duration */}
                  {DateAdded && (
                    <td className="pl-2 text-right text-white md:text-left text-[0.8rem] sm:text-[0.85rem] md:text-[0.9rem]">
                      {Math.floor(ts.song.duration / 60)}:
                      {String(ts.song.duration % 60).padStart(2, '0')}
                    </td>
                  )}

                  {/* Delete Button */}
                  <td className="w-[1%] text-center">
                    {isOwner && (
                      <div className="flex justify-center">
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
                      </div>
                    )}
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
