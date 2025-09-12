import React from 'react';
import '../../styles/playlist.css';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlaylistSong , SongSortBy , SortOrder  , getPlaylistDetails} from '../../services/playlistDetailsService';
import PlSongs from './PlSongs';
import '../../styles/playlist.css';

type Props = {
  refFetch?: React.MutableRefObject<() => void>;
};

const PlaylistSongs: React.FC<Props> = ({ refFetch }) => {
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState<SongSortBy>('createdAt');
  const [order, setOrder] = useState<SortOrder>('DESC');
  
  const fetchData = async () => {
    if (!slug) return;
    try {
      const data = await getPlaylistDetails(slug , {sortBy , order});
      setSongs(data.songs);
    } catch (err) {
      console.error(err);
    }
  };

  
  useEffect(() => {
    fetchData();
  }, [slug , sortBy , order]);


  
  useEffect(() => {
    if (refFetch) refFetch.current = fetchData;
  }, [refFetch]);

  return (
    <div className="playlist-container flex flex-wrap gap-4">
      <PlSongs songs={songs} setSortBy={setSortBy} setOrder={setOrder} sortBy={sortBy} order={order}/>
      
    </div>
  );
};

export default PlaylistSongs;
