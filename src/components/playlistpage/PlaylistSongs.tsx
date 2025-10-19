import React, { useEffect, useState, useRef } from 'react';
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
  playlistSongsRef?: React.MutableRefObject<(() => void | Promise<void>) | null>;
  isOwner: boolean | null;
  search: string;
  songs?: PlaylistSong[];
};

const PlaylistSongs: React.FC<Props> = ({
  playlistSongsRef,
  isOwner,
  search,
  songs: searchedSongs,
}) => {
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<PlaylistSong[]>([]);
  const [playlist, setPlaylist] = useState<Playlistinfo | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState<SongSortBy>('createdAt');
  const [order, setOrder] = useState<SortOrder>('DESC');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const isLoadingMore = useRef(false);
  const hasMore = useRef(true);

  const fetchData = async () => {
    if (!slug) return;
    try {
      const data = await getPlaylistDetails(slug, { page: 1, limit, sortBy, order });

      setSongs(data.songs);
      setFilteredSongs(data.songs);
      setPlaylist(data);
      setPage(1);
      hasMore.current = data.songs.length >= limit;
    } catch (err) {
      console.error('Error fetching playlist:', err);
    }
  };

  useEffect(() => {
    if (!playlistSongsRef) return;
    playlistSongsRef.current = fetchData;
    return () => {
      if (playlistSongsRef) playlistSongsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistSongsRef, slug, sortBy, order]);

  useEffect(() => {
    if (search.trim().length === 0) {
      setFilteredSongs(songs);
    } else if (searchedSongs && searchedSongs.length > 0) {
      setFilteredSongs(searchedSongs);
    } else {
      setFilteredSongs([]);
    }
  }, [search, searchedSongs, songs]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, sortBy, order]);

  const loadMore = async () => {
    if (isLoadingMore.current || !hasMore.current || !slug) return;
    isLoadingMore.current = true;

    try {
      const nextPage = page + 1;
      const data = await getPlaylistDetails(slug, { page: nextPage, limit, sortBy, order });

      const newSongs = data.songs.filter(
        (newSong) => !songs.some((old) => old.song.id === newSong.song.id)
      );

      if (newSongs.length > 0) {
        setSongs((prev) => [...prev, ...newSongs]);
        setFilteredSongs((prev) => [...prev, ...newSongs]);
        setPage(nextPage);
      } else {
        hasMore.current = false;
      }
    } catch (err) {
      console.error('Error loading more songs:', err);
    } finally {
      isLoadingMore.current = false;
    }
  };

  const deleteMusic = async (songId: number) => {
    if (!playlist?.id) return;
    setDeletingId(songId);
    try {
      const res = await playlistService.Deletemusic(`${playlist.id}`, `${songId}`);
      if (res?.stat === 'success') {
        setSongs((prev) => prev.filter((ts) => ts.song.id !== songId));
        setFilteredSongs((prev) => prev.filter((ts) => ts.song.id !== songId));
      }
    } catch (err) {
      console.error('Error deleting song:', err);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
      if (bottom) loadMore();
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, songs, slug, sortBy, order]);

  return (
    <div className="playlist-container flex flex-wrap gap-4 mt-9">
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
      {isLoadingMore.current && (
        <div className="w-full text-center text-gray-400 py-3">Loading more songs...</div>
      )}
      {!hasMore.current && (
        <div className="w-full text-center text-gray-500 py-3 text-sm">No more songs 👀</div>
      )}
    </div>
  );
};

export default PlaylistSongs;
