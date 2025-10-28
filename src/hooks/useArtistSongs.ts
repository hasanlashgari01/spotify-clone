import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateSongPayload, UploadSongPayload } from "../types/song.type";

import {
  fetchSongByArtist,
  uploadSongByArtist,
  updateSongByArtist,
  deleteSongByArtist,
} from '../services/ArtistServicesApi';

// #1 fetch artist's songs
export const useFetchArtistSongs = () =>
  useQuery({
    queryKey: ['artistSongs'],
    queryFn: fetchSongByArtist,
  });

// #2 uplaod new song
export const useUploadSongs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (songData: UploadSongPayload) =>
      await uploadSongByArtist(songData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistSongs'] });
    },
    onError: (error: any) => {
      console.error('Upload failed ❌', error);
    },
  });
};

// #3 edit music
export const useUpdateSongs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateSongPayload) =>
      await updateSongByArtist(payload.id, payload.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistSongs'] });
    },
    onError: (error: any) => {
      console.error('Update failed ❌', error);
    },
  });
};

//#4 delete music
export const useDeleteSongs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => await deleteSongByArtist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistSongs'] });
    },
    onError: (error: any) => {
      console.error('Delete failed ❌', error);
    },
  });
};
