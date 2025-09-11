import React, { useState, useEffect } from 'react';
import { Song } from '../../types/song.type';
import PauseIcon from '../icons/PauseIcon';
import PlayIcon from '../icons/PlayIcon';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { useParams } from 'react-router-dom';
import {
  getPlaylistDetails,
  PlaylistSong,
} from '../../services/playlistDetailsService';
import PlaylistSongs from './PlaylistSongs';
interface PlSongsProps {
  songs: Song[];
}

const SearchcedSongs: React.FC<PlSongsProps> = ({ songs }) => {
  const { slug } = useParams<{ slug: string }>();
  const { currentTrack, isPlaying, playSong, handlePlayPause } =
    useMusicPlayer();
  const [Album, setAlbum] = useState(true);
  const [DateAdded, setDateAdded] = useState(true);
  const [playSongs, setPlaysongs] = useState<PlaylistSong[]>([]);
  const [HoveredRow, setHoveredRow] = useState<number | null>(null);
  const [Duration, setDuration] = useState<Boolean>(true);
  const Songs: Song[] = [];

  const handlePlayClick = (song: Song, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const isActive = currentTrack?.id === song.id;

    if (isActive) {
      handlePlayPause();
    } else {
      playSong(song);
    }
  };
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const data = await getPlaylistDetails(slug);
        setPlaysongs(data.songs);
        playSongs.forEach((ps) => {
          Songs.push(ps.song);
        });
        console.log(playSongs);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchData();
  }, [slug]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 780) {
        setAlbum(false);
        setDateAdded(false);
        setDuration(false);
      } else {
        setAlbum(true);
        setDateAdded(true);
        setDuration(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex w-full justify-start pt-3 pb-3">
      <table className="text-left">
        
        <tbody >
          {songs.map((song, i) => {
            const isActive = currentTrack?.id === song.id;
            const inPlaylist = playSongs.some((ps) => ps.song.id === song.id);
            return (
              <tr
                key={i}
                className="song-tableRow border-b border-gray-700 transition hover:bg-gray-800/40 flex justify-start items-center w-content"
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="relative w-5 text-center">
                  <span
                    style={{ color: 'white' }}
                    className={
                      HoveredRow === i ? '-z-10 opacity-0' : 'z-10 opacity-100'
                    }
                  >
                    {i + 1}
                  </span>
                  <div
                    onClick={(e) => handlePlayClick(song, e)}
                    className={`playBTN absolute top-1/2 left-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-green-600 p-1 ml-1 ${
                      HoveredRow === i ? 'z-10 opacity-100' : '-z-10 opacity-0'
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
                      <h3
                        className={
                          Album
                            ? 'font-md w-[40vw] text-start font-bold text-white'
                            : 'font-md w-[60vw] text-start font-bold text-white'
                        }
                      >
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
                    onClick={()=>{
                      
                    }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="text-green-600 w-6 h-6"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="h-6 w-6 text-gray-400 transition-all hover:text-white"
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
