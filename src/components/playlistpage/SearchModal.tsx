import React, { useState, useEffect, useCallback } from 'react';
import { Song, AllSongs } from '../../types/song.type';
import { songService } from '../../services/songService';
import Fuse from 'fuse.js';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { useParams } from 'react-router-dom';
import { getPlaylistDetails } from '../../services/playlistDetailsService';
import { playlistService } from '../../services/playlistService';
import LoadingCircle from '../loading/LoadingCircle';
import { PlayIcon, PauseIcon } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  refFetch?: React.MutableRefObject<() => void>;
}

const SearchModal: React.FC<SearchModalProps> = ({
  open,
  onClose,
  refFetch,
}) => {
  const [query, setQuery] = useState('');
  const [allResults, setAllResults] = useState<Song[]>([]);
  const [visibleResults, setVisibleResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [cachedPages, setCachedPages] = useState<{ [page: number]: Song[] }>(
    {}
  );
  const [songsInPlaylist, setSongsInPlaylist] = useState<Song[]>([]);
  const [playlistId, setPlaylistId] = useState<number>();
  const [loadingSongId, setLoadingSongId] = useState<number | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const { currentTrack, isPlaying, playSong, handlePlayPause } =
    useMusicPlayer();
  const isTablet = useMediaQuery({ maxWidth: 1280 });
  const resultsPerPage = 8;
  const showMoreCount = 10;

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setAllResults([]);
    setVisibleResults([]);
    setMessage(null);
    setCachedPages({});
    setSongsInPlaylist([]);
    setPlaylistId(undefined);
    setLoadingSongId(null);
    setHoveredRow(null);
    // Fetch playlist songs for add-to-playlist logic
    if (slug) {
      getPlaylistDetails(slug).then((data) => {
        setPlaylistId(data.id);
        setSongsInPlaylist(data.songs.map((ps) => ps.song));
      });
    }
  }, [open, slug]);

  useEffect(() => {
    if (!open) return;
    const handler = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setAllResults([]);
      setVisibleResults([]);
      setMessage(null);
      return;
    }
    setLoading(true);
    setAllResults([]);
    setVisibleResults([]);
    setMessage(null);
    let page = 1;
    const limit = 40;
    let lastPage = false;
    let foundSongs: Song[] = [];
    let allFetchedSongs: Song[] = [];
    try {
      while (!lastPage) {
        let songsPage: Song[] = [];
        if (cachedPages[page]) {
          songsPage = cachedPages[page];
        } else {
          const data: AllSongs = await songService.getAllSongs(page, limit);
          songsPage = data.songs;
          setCachedPages((prev) => ({ ...prev, [page]: songsPage }));
          lastPage = page >= data.pagination.pageCount;
        }
        allFetchedSongs = [...allFetchedSongs, ...songsPage];
        const fuse = new Fuse(allFetchedSongs, {
          keys: ['title', 'artist.fullName'],
          threshold: 0.4,
        });
        const results = fuse.search(query);
        if (results.length > 0) {
          foundSongs = results.map((r) => r.item);
          break;
        }
        page++;
        if (!cachedPages[page] && lastPage) break;
      }
      if (foundSongs.length > 0) {
        setAllResults(foundSongs);
        setVisibleResults(foundSongs.slice(0, resultsPerPage));
      } else {
        setMessage('Nothing found');
      }
    } catch (err) {
      setMessage('Error occurred');
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [query, cachedPages]);

  const handleShowMore = () => {
    const currentCount = visibleResults.length;
    const nextResults = allResults.slice(
      currentCount,
      currentCount + showMoreCount
    );
    setVisibleResults([...visibleResults, ...nextResults]);
  };

  const handlePlayClick = (song: Song, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentTrack?.id === song.id) handlePlayPause();
    else playSong(song);
  };

  const handleAddToPlaylist = async (song: Song) => {
    setLoadingSongId(song.id);
    try {
      if (!playlistId) return;
      await playlistService.Addmusic(`${playlistId}`, `${song.id}`);
      setSongsInPlaylist((prev) =>
        prev.some((s) => s.id === song.id) ? prev : [...prev, song]
      );
      if (refFetch && refFetch.current) refFetch.current();
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSongId(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#181c24] p-6 shadow-lg">
        <button
          className="absolute top-4 right-4 text-2xl font-bold text-white hover:text-red-400"
          onClick={onClose}
        >
          ×
        </button>
        <div className="flex flex-col items-center md:items-start">
          <h2 className="ml-3 p-2 text-2xl font-bold text-white">
            Let's find something for your playlist
          </h2>
          <div className="ml-3 flex w-[90%] items-center gap-2 rounded-xl bg-gray-600 p-3 md:w-[40%]">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for songs or episodes"
              className="h-full w-full border-none bg-transparent text-white outline-none"
              autoFocus
            />
          </div>
        </div>
        <div className="playlist-container mt-4 flex flex-col flex-wrap items-center gap-4 md:items-start">
          {loading && <p className="text-white">Loading...</p>}
          {query.trim() && visibleResults.length > 0 && (
            <div className="flex w-full justify-center pt-3 pb-3">
              <div className="w-full max-w-[600px]">
                <div className="h-[350px] overflow-y-auto rounded-xl bg-[#23272f]">
                  <table className="w-full table-fixed text-left">
                    <colgroup>
                      <col style={{ width: '40px' }} />
                      <col style={{ width: '1fr' }} />
                      <col style={{ width: '60px' }} />
                    </colgroup>
                    <tbody>
                      {visibleResults.map((song, i) => {
                        const isActive = currentTrack?.id === song.id;
                        const inPlaylist = songsInPlaylist.some(
                          (s) => s.id === song.id
                        );
                        return (
                          <tr
                            key={song.id}
                            className="song-tableRow border-b border-gray-700 transition hover:bg-gray-800/40"
                            onMouseEnter={() => setHoveredRow(i)}
                            onMouseLeave={() => setHoveredRow(null)}
                          >
                            {/* شماره */}
                            <td className="relative w-5 max-w-[40px] overflow-hidden text-center align-middle">
                              <span
                                className={
                                  hoveredRow === i
                                    ? '-z-10 opacity-0'
                                    : 'z-10 opacity-100'
                                }
                                style={{ color: 'white' }}
                              >
                                {i + 1}
                              </span>
                              <div
                                onClick={(e) => handlePlayClick(song, e)}
                                className={`playBTN absolute top-1/2 left-1/2 ml-1 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-green-600 p-1 text-white ${
                                  hoveredRow === i || isTablet
                                    ? 'z-10 opacity-100'
                                    : '-z-10 opacity-0'
                                }`}
                              >
                                {isActive && isPlaying ? (
                                  <PauseIcon />
                                ) : (
                                  <PlayIcon />
                                )}
                              </div>
                            </td>
                            {/* اطلاعات آهنگ */}
                            <td className="pr-2 pl-0 align-middle">
                              <div className="flex items-center gap-3">
                                <img
                                  src={song.cover}
                                  className="h-12 w-12 flex-shrink-0 rounded-lg"
                                  alt={song.title}
                                />
                                <div className="flex min-w-0 flex-col items-start justify-center">
                                  <h3 className="font-md max-w-[180px] truncate text-start font-bold text-white">
                                    {song.title}
                                  </h3>
                                  <h4 className="max-w-[160px] truncate text-sm text-white">
                                    {song.artist.fullName}
                                  </h4>
                                </div>
                              </div>
                            </td>
                            {/* آیکون add/check */}
                            <td className="w-10 text-center align-middle">
                              {inPlaylist ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="h-6 w-6 text-green-600"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                </svg>
                              ) : loadingSongId === song.id ? (
                                <LoadingCircle />
                              ) : (
                                <svg
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToPlaylist(song);
                                  }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  fill="currentColor"
                                  className="h-6 w-6 cursor-pointer text-gray-400 transition-all hover:text-white"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                </svg>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {query.trim() && message && <p className="text-white">{message}</p>}
          {visibleResults.length < allResults.length && !loading && (
            <button
              onClick={handleShowMore}
              className="mt-4 w-30 cursor-pointer rounded-xl border-2 border-white p-2 text-white"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
