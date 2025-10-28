import { httpService } from "../config/axios";
import { createFormData } from "./../hooks/formData";

import {
  ArtistSong,
  UploadSongPayload,
  SongResponse,
  DeleteResponse,
} from '../types/song.type';

// #1 fetch music list
export const fetchSongByArtist = async (): Promise<ArtistSong[]> => {
  const { data } = await httpService.get<ArtistSong[]>('/song/my');
  return data;
};

// #2 uplaod new song
export const uploadSongByArtist = async (
  songData: UploadSongPayload
): Promise<SongResponse> => {
  try {
    const formData = createFormData(songData);
    const { data } = await httpService.post<SongResponse>('/song', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Upload failed');
  }
};

// #3 edit song
export const updateSongByArtist = async (
  id: string,
  updates: Partial<UploadSongPayload>
): Promise<SongResponse> => {
  try {
    const formData = createFormData(updates);
    const { data } = await httpService.patch<SongResponse>(
      `/song/${id}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Update failed');
  }
};

// #4 delete song
export const deleteSongByArtist = async (
  id: string
): Promise<DeleteResponse> => {
  try {
    const { data } = await httpService.delete<DeleteResponse>(`/song/${id}`);
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Delete failed');
  }
};
