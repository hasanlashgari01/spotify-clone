import { httpService } from '../config/axios';
import { createFormData } from './formData';

import {
  ArtistSong,
  UploadSongPayload,
  UserProfile,
  CallbackResponse,
  UserInfo,
} from '../types/song.type';

// #1 fetch music list
export const fetchSongByArtist = async (): Promise<ArtistSong[]> => {
  const { data } = await httpService.get<ArtistSong[]>('/song/my');
  return data;
};

// #2 uplaod new song
export const uploadSongByArtist = async (
  songData: UploadSongPayload
): Promise<ArtistSong> => {
  try {
    const formData = createFormData(songData);
    const { data } = await httpService.post<ArtistSong>('/song', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Upload failed');
  }
};

// #3 edit song
export const updateSongByArtist = async (
  id: number,
  updates: Partial<UploadSongPayload>
): Promise<ArtistSong> => {
  try {
    const formData = createFormData(updates);
    const { data } = await httpService.patch<ArtistSong>(
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
  id: number
): Promise<CallbackResponse> => {
  try {
    const { data } = await httpService.delete<CallbackResponse>(`/song/${id}`);
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Delete failed');
  }
};

// #5 update user Profile Info
export const updateUserProfileInfo = async (
  updates: UserInfo
): Promise<CallbackResponse> => {
  try {
    const formData = createFormData(updates);
    const { data } = await httpService.put('/user/my-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'update failed');
  }
};

// #6 fetch user Profile Info
export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    const { data } = await httpService.get('/user/my-profile');
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'update failed');
  }
};
// #7 fetch user Profile Info
export const toggleUserStatus = async (): Promise<{ message: string }> => {
  try {
    const { data } = await httpService.get('/user/status');
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'update failed');
  }
};
