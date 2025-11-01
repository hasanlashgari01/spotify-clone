import { httpService } from '../config/axios';
import { Song } from '../types/song.type';
import { Pagination } from './playlistService';

export interface Owner {
  id: 4;
  username: string;
  fullName: string;
  avatar: string | null;
}
export interface PlaylistSong {
  id: number;
  playlistId: number;
  song: Song;
  songId: number;
  createdAt: string;
  updatedAt: string;
}


export interface Playlistinfo {
  id: number;
  title: string;
  slug: string;
  description: string;
  cover: string;
  status: 'public' | 'private';
  owner: Owner;
  ownerId: number;
  songs: PlaylistSong[];
  createdAt: string;
  updatedAt: string;
  totalDuration: number;
  count: number;
  isLiked: boolean;
}
export interface PlaylistMeta {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  cover: string;
  status: 'public' | 'private';
  owner: Owner;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  totalDuration: number;
  count: number;
  isLiked: boolean;
}
export type SongSortBy = 'title' | 'artist' | 'duration' | 'createdAt';
export type SortOrder = 'ASC' | 'DESC';
export const getPlaylistDetails = async (
  slug: string,
  options?: {
    sortBy?: SongSortBy;
    order?: SortOrder;
    page: number;
    limit: number;
  }
): Promise<PlaylistMeta> => {
  const { data } = await httpService.get(`/playlists/${slug}/details`, {
    params: {
      page: options?.page,
      limit: options?.limit,
      sortBy: options?.sortBy,
      order: options?.order,
    },
  });
  return data;
};
export interface PlaylistSongsResponse {
  songs: PlaylistSong[];
  pagination: Pagination;
}

export const getPlaylistSongs = async (
  slug: string,
  options?: { page?: number; limit?: number; sortBy?: SongSortBy; order?: SortOrder }
): Promise<PlaylistSongsResponse> => {
  const { data } = await httpService.get(`/playlists/${slug}`, {
    params: {
      page: options?.page ?? 1,
      limit: options?.limit ?? 10,
      sortBy: options?.sortBy,
      order: options?.order,
    },
  });
  return data;
};


export type PlaylistStatus = 'public' | 'private';

export const updatePlaylistStatus = async (id: number): Promise<void> => {
  await httpService.put(`/playlists/${id}`);
};
