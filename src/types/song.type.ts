import { Dispatch, SetStateAction } from "react";

import {
  PlaylistSong,
  SongSortBy,
  SortOrder,
} from '../services/playlistDetailsService';

export interface Pagination {
  page: number;
  limit: number;
  pageCount: number;
  totalCount: number;
}

export interface ArtistInfo {
  id?: number;
  username: string;
  fullName: string;
  avatar?: string | null;
}

export interface SongGenre {
  id: number;
  genreId: number;
  songId: number;
}

export interface Song {
  id: number;
  title: string;
  audioUrl: string;
  cover: string;
  duration: number;
  status: 'PUBLISHED' | 'DRAFT' | 'PRIVATE' | string;
  plays: number;
  artist: ArtistInfo;
  artistId: number;
  genres: SongGenre[];
  createdAt: string;
  updatedAt: string;
}
export interface ArtistPopular {
  id: number;
  title: string;
  audioUrl: string;
  cover: string;
  duration: number;
  status: 'PUBLISHED' | 'DRAFT' | 'PRIVATE' | string;
  plays: number;
  artistId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistSong extends Song {
  genres: SongGenre[];
  artist: ArtistInfo;
}

export interface GenreInfo {
  id: number;
  slug: string;
  title: string;
  cover: string;
}

export interface GenreDetailsResponse {
  genre: GenreInfo;
  songs: Song[];
  pagination: Pagination;
}

export interface UseGenreDetailsParams {
  titleLowered?: string;
  sortBy: string;
  order: string;
}

export interface GenreDetailsWrapperProps {
  genreDetails: GenreInfo | null;
  songs: Song[];
  showSearch: boolean;
  setShowSearch: Dispatch<SetStateAction<boolean>>;
  setSearch: Dispatch<SetStateAction<string>>;
  search: string;
}

export interface PlSongsProps {
  songs: PlaylistSong[];
  sortBy: SongSortBy;
  order: SortOrder;
  setSortBy: Dispatch<SetStateAction<SongSortBy>>;
  setOrder: Dispatch<SetStateAction<SortOrder>>;
  isOwner: boolean | null;
  deleteMusic: (songId: number) => void;
  deletingId: number | null;
  ref: boolean;
}

export interface UploadSongPayload {
  title: string;
  genreId: number;
  status?: 'PUBLISHED' | 'DRAFT' | 'PRIVATE' | string;
  cover?: File | null;
  audio?: File | null;
}

export interface UpdateSongPayload {
  id: number;
  updates: Partial<UploadSongPayload>;
}

export interface CallbackResponse {
  message: string;
}

export interface UserInfo {
  fullName: string;
  bio?: string | null;
  avatar?: File | null;
  gender: 'male' | 'female' | 'other';
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  fullName: string;
  avatar: string | null;
  bio: string | null;
  gender: 'male' | 'female' | 'other' | null;
  status: 'public' | 'private';
  createdAt: string;
  updatedAt: string;
}

export type ApiResponse = {

  songs: Song[];

  pagination: {

    page: number;

    limit: number;

    pageCount: number;

    totalCount: number;

  };

};
