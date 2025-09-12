import { httpService } from '../config/axios';

export interface Artist {
  id: number;
  username: string;
  fullName: string;
}
export interface Owner {
  id: Number;
  username: string;
  fullName: string;
  avatar: string | null;
}
export interface Song {
  id: number;
  title: string;
  audioUrl: string;
  cover: string;
  duration: number;
  status: string;
  plays: number;
  artist: Artist;
  artistId: number;
  createdAt: string;
  updatedAt: string;
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
