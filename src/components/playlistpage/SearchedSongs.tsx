import { useEffect, useState } from 'react';
import { Song } from '../../types/song.type';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { useParams } from 'react-router-dom';
import {
  PlaylistSong,
  getPlaylistDetails,
} from '../../services/playlistDetailsService';
import { playlistService } from '../../services/playlistService';
import LoadingCircle from '../loading/LoadingCircle';
import { PlayIcon, PauseIcon } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
interface Props {
  songs: Song[];
  refFetch?: React.MutableRefObject<() => void>;
}

const SearchcedSongs: React.FC<Props> = ({ songs, refFetch }) => {
  const { slug } = useParams<{ slug: string }>();
  const { currentTrack, isPlaying, playSong, handlePlayPause } =
    useMusicPlayer();

  const [, setPlaysongs] = useState<PlaylistSong[]>([]);
  const [songsInPlaylist, setSongsInPlaylist] = useState<Song[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [playlistId, setPlaylistId] = useState<number>();
  const isTablet = useMediaQuery({ maxWidth: 1280 });
  const [loadingSongId, setLoadingSongId] = useState<number | null>(null);

  const handlePlayClick = (song: Song, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentTrack?.id === song.id) handlePlayPause();
    else playSong(song);
  };

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        const data = await getPlaylistDetails(slug);
        setPlaylistId(data.id);
        setPlaysongs(data.songs);
        setSongsInPlaylist(data.songs.map((ps) => ps.song));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [slug]);

  const handleAddToPlaylist = async (song: Song) => {
    setLoadingSongId(song.id);
    try {
      await playlistService.Addmusic(`${playlistId}`, `${song.id}`);
      setSongsInPlaylist((prev) =>
        prev.some((s) => s.id === song.id) ? prev : [...prev, song]
      );

      if (refFetch && refFetch.current) refFetch.current();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSongId(null);
    }
  };

  return (
    <div className="flex w-full justify-start pt-3 pb-3">
      <table className="text-left">
        <tbody>
          {songs.map((song, i) => {
            const isActive = currentTrack?.id === song.id;
            const inPlaylist = songsInPlaylist.some((s) => s.id === song.id);

            return (
              <tr
                key={song.id}
                className="song-tableRow flex w-full items-center justify-start border-b border-gray-700 transition hover:bg-gray-800/40"
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="relative w-5 text-center">
                  <span
                    className={
                      hoveredRow === i ? '-z-10 opacity-0' : 'z-10 opacity-100'
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
                    {isActive && isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </div>
                </td>

                <td>
                  <div className="flex gap-4">
                    <img
                      src={song.cover}
                      className="h-12 w-12 rounded-lg"
                      alt={song.title}
                    />
                    <div className="flex flex-col items-start justify-center">
                      <h3 className="font-md w-[60vw] text-start font-bold text-white">
                        {song.title}
                      </h3>
                      <h4 className="text-sm text-white">
                        {song.artist.fullName}
                      </h4>
                    </div>
                  </div>
                </td>

                <td>
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
  );
};

export default SearchcedSongs;
