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
      <div className="ml-3 flex w-[90vw] md:w-120 text-s md:text-lg items-center gap-2 rounded-xl bg-gray-600 mt-7 p-3">
          <input
            type="search"
            
            
            placeholder="Discover Your Playlist"
            className="h-full w-full border-none text-white outline-none "
          />

          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-5 w-5  text-white cursor-pointer" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </div>
      <PlSongs songs={songs} setSortBy={setSortBy} setOrder={setOrder} sortBy={sortBy} order={order}/>
      
    </div>
  );
};

export default PlaylistSongs;
