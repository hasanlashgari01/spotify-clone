import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlaylistSong, getPlaylistDetails } from '../../services/playlistDetailsService';
import PlSongs from './PlSongs';
import '../../styles/playlist.css';

type Props = {
  refFetch?: React.MutableRefObject<() => void>;
};

const PlaylistSongs: React.FC<Props> = ({ refFetch }) => {
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const { slug } = useParams<{ slug: string }>();

  const fetchData = async () => {
    if (!slug) return;
    try {
      const data = await getPlaylistDetails(slug);
      setSongs(data.songs);
    } catch (err) {
      console.error(err);
    }
  };

  
  useEffect(() => {
    fetchData();
  }, [slug]);

  
  useEffect(() => {
    if (refFetch) refFetch.current = fetchData;
  }, [refFetch]);

  return (
    <div className="playlist-container flex flex-wrap gap-4">
      <PlSongs songs={songs} />
    </div>
  );
};

export default PlaylistSongs;
