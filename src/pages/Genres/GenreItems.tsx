import ErrorMessage from "../../components/error/ErrorMessage";
import Loading from "../../components/loading/Loading";
import PlSongs from "../../components/playlistpage/PlSongs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../config/axios";
import { ApiResponse, Song } from "./../../types/song.type";

import {
  PlaylistSong,
  Playlistinfo,
  SongSortBy,
  SortOrder,
} from '../../services/playlistDetailsService';

const GenreItems = () => {
  const { id } = useParams<{ id: string }>(); // genre ID from URL
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SongSortBy>('title'); // or any default field
  const [order, setOrder] = useState<SortOrder>('ASC');
  const [deleteMusic, setDeleteMusic] = useState<number | null>(null);
  const [isOwner] = useState<boolean | null>(null);

  //# send props to PlSongs started
  const playlistSongs = songs.map((song) => ({
    id: song.id,
    playlistId: Number(id),
    song,
    songId: song.id,
    createdAt: song.createdAt,
    updatedAt: song.updatedAt,
    artistId: song.artist.id,
  })) as PlaylistSong[];
  //# send props to PlSongs ended

  // @ SORT MENU CONFIG Start
  const getPlaylistDetails = async (
    id: string,
    options?: { sortBy?: SongSortBy; order?: SortOrder }
  ): Promise<Playlistinfo> => {
    const { data } = await httpService.get(`/song/genre/${id}`, {
      params: {
        sortBy: options?.sortBy,
        order: options?.order,
      },
    });
    return data;
  };
  // @ SORT MENU CONFIG End

  useEffect(() => {
    if (!id) return;
    const fetchSongs = async () => {
      try {
        const response = await httpService.get<ApiResponse>(
          `/song/genre/${id}`,
          {
            params: { sortBy, order },
          }
        );
        setSongs(response.data.songs);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    getPlaylistDetails(id);
    fetchSongs();
  }, [id, sortBy, order]);

  // & error and loading handling
  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  //! deleteMusic By id started
  const deleteMusicById = (songId: number) => {
    setDeleteMusic(songId);
    setSongs((prev) => prev.filter((prevMusic) => prevMusic.id === songId));
    setDeleteMusic(null);
  };
  //! deleteMusic By id ended

  return (
    <div className="no-scrollbar bgColor">
      {songs.length === 0 ? (
        <h4>No songs found for this genre.</h4>
      ) : (
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
      )}
    </div>
  );
};

export default GenreItems;
