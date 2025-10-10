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
import { playlistService } from '../../services/playlistService';

type Props = {
  refFetch?: React.MutableRefObject<() => void>;
  isOwner: boolean | null;
  search: string;
};

const PlaylistSongs: React.FC<Props> = ({ refFetch, isOwner, search }) => {
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<PlaylistSong[]>([]);
  const [playlist, setPlaylist] = useState<Playlistinfo | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState<SongSortBy>('createdAt');
  const [order, setOrder] = useState<SortOrder>('DESC');
  const [deletingId, setDeletingId] = useState<number | null>(null);

 
  const fetchData = async () => {
    if (!slug) return;
    try {
      const data = await getPlaylistDetails(slug, { sortBy, order });
      setSongs(data.songs);
      setFilteredSongs(data.songs);
      setPlaylist(data);
    } catch (err) {
      console.error(err);
    } finally {
      // no-op
    }
  };

  
  const deleteMusic = async (songId: number) => {
    if (!playlist?.id) return;
    setDeletingId(songId);
    try {
      const res = await playlistService.Deletemusic(
        `${playlist.id}`,
        `${songId}`
      );
      if (res?.stat === 'error') return;

      if (res?.stat === 'success') {
        setSongs((prev) => prev.filter((ts) => ts.song.id !== songId));
        setFilteredSongs((prev) => prev.filter((ts) => ts.song.id !== songId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  
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
    <div className="playlist-container flex flex-wrap gap-4 mt-9 ">
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
    </div>
  );
};

export default PlaylistSongs;
