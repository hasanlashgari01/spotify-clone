// components/playlist/PlaylistSongs.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlaylistSong, getPlaylistDetails } from '../../services/playlistDetailsService';
import PlSongs from './PlSongs'; // کامپوننت جدید
import '../../styles/playlist.css';

const PlaylistSongs: React.FC = () => {
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const { slug } = useParams<{ slug: string }>();

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
    <div className="playlist-container flex flex-wrap gap-4">
      {/* فقط PlSongs رو صدا می‌زنیم و songs رو پاس می‌کنیم */}
      <PlSongs songs={songs} />
    </div>
  );
};

export default PlaylistSongs;
