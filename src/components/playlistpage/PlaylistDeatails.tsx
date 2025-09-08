import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getPlaylistDetails,
  Playlistinfo,
  PlaylistSong,
} from '../../services/playlistDetailsService';

const PlaylistDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [playlist, setPlaylist] = useState<Playlistinfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const data = await getPlaylistDetails(slug);
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
    return <div className=" text-white w-full flex justify-center items-center pt-30">Loading...</div>;
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

      <div className="flex flex-col items-center justify-center px-5 text-center md:items-start md:text-left">
        <span className="text-sm text-white sm:text-base">
          {playlist.status} playlist
        </span>

        <span className="mt-2 text-3xl font-bold text-white sm:text-4xl md:text-6xl">
          {playlist.title}
        </span>

        <span className="mt-10 flex flex-wrap justify-center gap-2 text-sm sm:text-base md:justify-start">
          <span className="font-bold text-white flex gap-1 items-center">
            <img src={playlist.owner.avatar||'/default-avatar.webp'} alt={playlist.owner.fullName} className='rounded-full w-8 h-8' />
            <span>{playlist.owner.username}</span>
          </span>
          <span className="text-[#ffffff86] flex gap-1 items-center">
            {playlist.songs.length} songs,
          </span>
          <span className="text-[#ffffff86] flex gap-1 items-center">
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
