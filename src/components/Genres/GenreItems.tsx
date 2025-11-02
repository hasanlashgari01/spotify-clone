import ErrorMessage from '../error/ErrorMessage';
import GenreDetailsWrapper from './GenreDetailsWrapper';
import PlSongs from '../playlistpage/PlSongs';
import { useMemo, useState } from 'react';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useGenreDetails } from '../../hooks/useFechSongs';
import { SongSortBy, SortOrder } from '../../services/playlistDetailsService';
import { Song } from '../../types/song.type';
import LuxeLoader from '../loading/LuxeLoader';

const GenreItems = () => {
  const { title = '' } = useParams<{ title: string }>();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SongSortBy>('title');
  const [order, setOrder] = useState<SortOrder>('ASC');
  const [deleteMusic] = useState<number | null>(null);
  const [isOwner] = useState(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const loadMoreRef = useRef<HTMLTableRowElement | null>(null);
  const titleLowered = title.toLowerCase();

  const {
    data: genreDetailsQuery,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    error,
  } = useGenreDetails({
    titleLowered,
    sortBy,
    order,
  });
  const pages = genreDetailsQuery?.pages ?? [];
  const genreDetails = pages[0]?.genre ?? null;
  const songs = pages.flatMap((info) => info.songs);
  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '100px' }
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, pages]);

  const playlistSongs = useMemo(
    () =>
      songs.map((song: Song) => ({
        id: song.id,
        playlistId: Number(song.id),
        song,
        songId: song.id,
        createdAt: song.createdAt,
        updatedAt: song.updatedAt,
        artistId: song.artist.id,
      })),
    [songs]
  );

  const deleteMusicById = () => {};

  if (isLoading)
    return (
      <div className="flex min-h-[100vh] w-full items-center justify-center bg-[linear-gradient(180deg,#1574F5_0%,#1453AB_16%,#13458A_35%,#112745_55%,#101721_75%,#101721_100%)]">
        <LuxeLoader />
      </div>
    );
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="bgColor">
      {songs.length === 0 ? (
        <ErrorMessage error={'No songs found for this genre'} />
      ) : (
        <>
          <GenreDetailsWrapper
            genreDetails={genreDetails}
            songs={songs}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            setSearch={setSearch}
            search={search}
          />
          <PlSongs
            songs={playlistSongs}
            sortBy={sortBy}
            order={order}
            setSortBy={setSortBy}
            setOrder={setOrder}
            isOwner={isOwner}
            deleteMusic={deleteMusicById}
            deletingId={deleteMusic}
            ref={loadMoreRef}
          />
        </>
      )}
    </div>
  );
};

export default GenreItems;
