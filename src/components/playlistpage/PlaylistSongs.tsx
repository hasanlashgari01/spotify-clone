import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  PlaylistSong,
  getPlaylistDetails,
} from '../../services/playlistDetailsService';
import '../../styles/playlist.css';

const PlaylistSongs = () => {
  const [Album, setAlbum] = useState(true);
  const [DateAdded, setDateAdded] = useState(true);
  const [HoveredRow, setHoveredRow] = useState<number | null>(null);
  const [songs, setSongs] = useState<PlaylistSong[] | null>(null);
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 922) {
        setDateAdded(false);
      } else if (window.innerWidth > 922) {
        setDateAdded(true);
      }
      if (window.innerWidth <= 520) {
        setAlbum(false);
      } else if (window.innerWidth >= 520) {
        setAlbum(true);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  //-------------------------------------
  // data.song.audioUrl to get the music URL
  //-------------------------------------
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const data = await getPlaylistDetails(slug);
        setSongs(data.songs);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchData();
  }, [slug]);

  return (
    <div className="flex w-full justify-start pt-3 pb-3">
      <table className="text-left">
        <thead className="text-white">
          <th className="h-5 w-5">
            <h6 className="text-center">#</h6>
          </th>
          <th
            className={
              Album === false
                ? 'w-[60vw] pl-2 text-start'
                : 'w-[40vw] pl-2 text-start'
            }
          >
            Title
          </th>
          {Album && (
            <th
              className={
                DateAdded === false
                  ? 'w-[40vw] pl-3 text-start'
                  : 'w-[20vw] pl-3 text-start'
              }
            >
              Status
            </th>
          )}
          {DateAdded && (
            <th className="w-[20vw] pl-3 text-start">Date added</th>
          )}
          <th className="w-[20vw] pl-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="white"
              className="text-black"
              viewBox="0 0 16 16"
            >
              <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z" />
              <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
              <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
            </svg>
          </th>
        </thead>
        <tbody>
          {songs?.map((ts, i) => (
            <tr
              key={i}
              className="song-tableRow border-b border-gray-700 transition hover:bg-gray-800/40"
              onMouseEnter={() => {
                setHoveredRow(i);
              }}
              onMouseLeave={() => {
                setHoveredRow(null);
              }}
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
                <svg
                  className={`playBTN absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform text-white ${HoveredRow === i ? 'z-10 opacity-100' : '-z-10 opacity-0'}`}
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                </svg>
              </td>
              <td>
                <div className="flex gap-4">
                  <img
                    src={ts.song.cover}
                    className="h-12 w-12 rounded-lg"
                    alt=""
                  />
                  <div className="flex flex-col items-start justify-center">
                    <h3
                      className={
                        Album === false
                          ? 'font-md w-[60vw] text-start font-bold text-white'
                          : 'font-md w-[40vw] text-start font-bold text-white'
                      }
                    >
                      {ts.song.title}
                    </h3>
                    <h4 className="text-sm text-white">
                      {ts.song.artist.fullName}
                    </h4>
                  </div>
                </div>
              </td>
              {Album && (
                <td className="">
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
              {DateAdded && (
                <td className="text-white">
                  {ts.song.createdAt.split('T').shift()}
                </td>
              )}
              <td className="w-[30vw] pl-2 text-white">
                {Math.floor(ts.song.duration / 60)}:
                {String(ts.song.duration % 60).padStart(2, '0')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlaylistSongs;
