import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../../styles/playlist.css';
import { useParams } from 'react-router-dom';
import {
  PlaylistSong,
  SongSortBy,
  SortOrder,
  getPlaylistDetails, // فقط متادیتا
} from '../../services/playlistDetailsService';
import PlSongs from './PlSongs';
import { playlistService } from '../../services/playlistService';

// از services: یک تابع برای گرفتن آهنگ‌ها اضافه کن
// getPlaylistSongs(slug, {page, limit, sortBy, order}) که { songs, pagination } برگرداند.

type Props = {
  playlistSongsRef?: React.MutableRefObject<(() => void | Promise<void>) | null>;
  isOwner: boolean | null;
  search: string;
  songs?: PlaylistSong[];
};

const limit = 10;

const PlaylistSongs: React.FC<Props> = ({
  playlistSongsRef,
  isOwner,
  search,
  songs: searchedSongs,
}) => {
  const { slug } = useParams<{ slug: string }>();

  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<PlaylistSong[]>([]);
  const [playlistMeta, setPlaylistMeta] = useState<null | {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    cover: string;
    status: 'public' | 'private';
    owner: { id: number; username: string; fullName: string; avatar: string | null };
    ownerId: number;
    createdAt: string;
    updatedAt: string;
    totalDuration: number;
    count: number;
    isLiked: boolean;
  }>(null);

  const [sortBy, setSortBy] = useState<SongSortBy>('createdAt');
  const [order, setOrder] = useState<SortOrder>('DESC');

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [page, setPage] = useState<number>(1);
  const isLoadingMore = useRef(false);
  const hasMore = useRef(true);

  const applyFilter = useCallback(
    (base: PlaylistSong[]) => {
      if (!search.trim()) return base;
      if (searchedSongs && searchedSongs.length > 0) return searchedSongs;
      return [];
    },
    [search, searchedSongs]
  );

  const fetchFirstPage = useCallback(async () => {
    if (!slug) return;
    try {
      // فقط متادیتا
      const meta = await getPlaylistDetails(slug);
      setPlaylistMeta(meta);

      // لیست آهنگ‌ها + صفحه‌بندی
      const listResp = await playlistService.getPlaylistSongs(slug, {
        page: 1,
        limit,
        sortBy,
        order,
      });
      const safeSongs: PlaylistSong[] = Array.isArray(listResp?.songs) ? listResp!.songs : [];
      setSongs(safeSongs);
      setFilteredSongs(applyFilter(safeSongs));
      setPage(1);

      const total = listResp?.pagination?.totalCount ?? safeSongs.length;
      const currentCount = safeSongs.length;
      hasMore.current = currentCount < total;
    } catch (err) {
      console.error('Error fetching playlist:', err);
      setSongs([]);
      setFilteredSongs([]);
      hasMore.current = false;
    }
  }, [slug, sortBy, order, applyFilter]);

  // اکسپوز رفرش به پدر
  useEffect(() => {
    if (!playlistSongsRef) return;
    playlistSongsRef.current = fetchFirstPage;
    return () => {
      if (playlistSongsRef) playlistSongsRef.current = null;
    };
  }, [playlistSongsRef, fetchFirstPage]);

  // واکنش به تغییر سرچ/سورت/اوردر/اسلاگ
  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  // فیلتر روی تغییر سرچ یا داده‌ها
  useEffect(() => {
    setFilteredSongs(applyFilter(songs));
  }, [search, searchedSongs, songs, applyFilter]);

  const loadMore = async () => {
    if (isLoadingMore.current || !hasMore.current || !slug) return;
    isLoadingMore.current = true;
    try {
      const nextPage = page + 1;
      const listResp = await playlistService.getPlaylistSongs(slug, {
        page: nextPage,
        limit,
        sortBy,
        order,
      });
      const incoming: PlaylistSong[] = Array.isArray(listResp?.songs) ? listResp!.songs : [];

      // جلوگیری از تکرار
      const unique = incoming.filter(
        (n) => !songs.some((o) => o.song.id === n.song.id)
      );

      if (unique.length > 0) {
        setSongs((prev) => [...prev, ...unique]);
        setFilteredSongs((prev) => applyFilter([...prev, ...unique]));
        setPage(nextPage);

        const total = listResp?.pagination?.totalCount ?? 0;
        const newCount = (songs?.length ?? 0) + unique.length;
        hasMore.current = newCount < total;
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
    if (!playlistMeta?.id) return;
    setDeletingId(songId);
    try {
      const res = await playlistService.Deletemusic(`${playlistMeta.id}`, `${songId}`);
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

  // اینفینیت اسکرول ساده
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
      if (nearBottom) loadMore();
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // وابستگی‌ها: page, songs, sort, order, slug می‌تواند باعث setState زیاد شود؛
    // این نسخه سبک‌تر است و به رفرنس‌ها تکیه دارد.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, slug, sortBy, order]);

  return (
    <div className="playlist-container flex flex-wrap gap-4 mt-9">
      <PlSongs
        songs={filteredSongs ?? []}
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
