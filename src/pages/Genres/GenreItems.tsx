import ErrorMessage from '../../components/error/ErrorMessage';
import GenreDetailsWrapper from './GenreDetailsWrapper';
import Loading from '../../components/MyPlayLists/loding';
import PlSongs from '../../components/playlistpage/PlSongs';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGenreDetails } from '../../hooks/useFechSongs';
import { SongSortBy, SortOrder } from '../../services/playlistDetailsService';
import { Song } from '../../types/song.type';

const GenreItems = () => {
  const { title = '' } = useParams<{ title: string }>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SongSortBy>('title');
  const [order, setOrder] = useState<SortOrder>('ASC');
  const [deleteMusic] = useState<number | null>(null);
  const [isOwner] = useState(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const titleLowered = title.toLowerCase();

  const { data, isLoading, error } = useGenreDetails({
    titleLowered,
    sortBy,
    order,
  });

  const genreDetails = data?.genre ?? null;
  const songs = data?.songs ?? [];

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

  const totalSeconds = songs.reduce((acc: any, s: any) => acc + s.duration, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const deleteMusicById = () => {};

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="no-scrollbar bgColor bg-[linear-gradient(180deg,#1574F5_0%,#1453AB_16%,#13458A_35%,#112745_55%,#101721_75%,#101721_100%)]">
      {songs.length === 0 ? (
        <h4>No songs found for this genre.</h4>
      ) : (
        <>
          <GenreDetailsWrapper
            genreDetails={genreDetails}
            songs={songs}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
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
          />
        </>
      )}
    </div>
  );
};

export default GenreItems;
