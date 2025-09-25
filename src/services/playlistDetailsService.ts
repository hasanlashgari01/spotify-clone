import { httpService } from '../config/axios';
import { Song } from '../types/song.type';

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
  isLiked: boolean;
  count: number;
}
export type SongSortBy = 'title' | 'artist' | 'duration' | 'createdAt';
export type SortOrder = 'ASC' | 'DESC';
export const getPlaylistDetails = async (
  slug: string,
  options?: { sortBy?: SongSortBy; order?: SortOrder }
): Promise<Playlistinfo> => {
  const { data } = await httpService.get(`/playlists/${slug}`, {
    params: {
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
