import React, { useEffect, useState } from 'react';
import '../../styles/playlist.css';
import { useParams } from 'react-router-dom';
import {
  PlaylistSong,
  Playlistinfo,
  SongSortBy,
  SortOrder,
  getPlaylistDetails,
} from '../../services/playlistDetailsService';
import PlSongs from './PlSongs';
import LoadingCircle from '../loading/LoadingCircle';
import { playlistService } from '../../services/playlistService';

type Props = {
  refFetch?: React.MutableRefObject<() => void>;
  isOwner: boolean | null;
};

const PlaylistSongs: React.FC<Props> = ({ refFetch, isOwner }) => {
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<PlaylistSong[]>([]);
  const [playlist, setPlaylist] = useState<Playlistinfo | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState<SongSortBy>('createdAt');
  const [order, setOrder] = useState<SortOrder>('DESC');
  const [loading, setLoading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState<string>('');

  // fetch playlist
  const fetchData = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const data = await getPlaylistDetails(slug, { sortBy, order });
      setSongs(data.songs);
      setFilteredSongs(data.songs);
      setPlaylist(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // delete music
  const deleteMusic = async (songId: number) => {
    if (!playlist?.id) return;
    setDeletingId(songId);
    try {
      const res = await playlistService.Deletemusic(`${playlist.id}`, `${songId}`);
      if (res?.statusCode !== 200) return;

      setSongs((prev) => prev.filter((ts) => ts.song.id !== songId));
      setFilteredSongs((prev) => prev.filter((ts) => ts.song.id !== songId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // update filtered songs on search change
  useEffect(() => {
    if (!search) {
      setFilteredSongs(songs);
    } else {
      const lower = search.toLowerCase();
      setFilteredSongs(
        songs.filter(
          (s) =>
            s.song.title.toLowerCase().includes(lower) ||
            s.song.artist.fullName.toLowerCase().includes(lower)
        )
      );
    }
  }, [search, songs]);

  useEffect(() => {
    fetchData();
  }, [slug, sortBy, order]);

 
  useEffect(() => {
    if (refFetch) refFetch.current = fetchData;
  }, [refFetch]);

  return (
    <div className="playlist-container flex flex-wrap gap-4 ">
      
      <div className='w-[100vw] flex  justify-center md:justify-end'>
        <div className="text-s mt-7 mr-3 flex w-120 items-center  gap-2 rounded-xl bg-gray-600 p-3 md:w-[120] md:text-lg">
        <input
          type="search"
          placeholder="Search songs..."
          className="h-full w-full border-none text-white outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="h-5 w-5 cursor-pointer text-white"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </div>
      </div>

      
      {loading ? (
        <LoadingCircle />
      ) : (
        <PlSongs
          songs={filteredSongs}
          setSortBy={setSortBy}
          setOrder={setOrder}
          sortBy={sortBy}
          order={order}
          isOwner={isOwner}
          deleteMusic={deleteMusic}
          deletingId={deletingId}
        />
      )}
    </div>
  );
};

export default PlaylistSongs;
