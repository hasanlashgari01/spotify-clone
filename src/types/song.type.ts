import { Dispatch, SetStateAction } from 'react';

import {
  PlaylistSong,
  SongSortBy,
  SortOrder,
} from '../services/playlistDetailsService';
export interface PlSongsProps {
  songs: PlaylistSong[];
  setSortBy: React.Dispatch<SetStateAction<SongSortBy>>;
  setOrder: React.Dispatch<SetStateAction<SortOrder>>;
  sortBy: SongSortBy;
  order: SortOrder;
  isOwner: boolean | null;
  deleteMusic: (songId: number) => void;
  deletingId: number | null;
  ref: boolean;
}
export interface Pagination {
  page: number;
  limit: number;
  pageCount: number;
  totalCount: number;
}
export interface AllSongs {
  songs: Song[];
  pagination: Pagination;
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

export type GenreInfo = {
  id: string;
  slug: string;
  title: string;
  cover: string;
};
export interface GenreDetailsResponse {
  genre: GenreInfo;
  songs: Song[];
  pagination: Pagination;
}

export interface Song {
  id: number;
  title: string;
  audioUrl: string;
  cover: string;
  duration: number;
  status: string;
  plays: number;
  artist: {
    id: number;
    username: string;
    fullName: string;
  };
  artistId: number;
  createdAt: string;
  updatedAt: string;
}
export type GenreDetailsWrapperProps = {
  genreDetails: GenreInfo | null;
  songs: any[];
  showSearch: boolean;
  setShowSearch: Dispatch<SetStateAction<boolean>>;
  setSearch: Dispatch<SetStateAction<string>>;
  search: string;
};
export interface UseGenreDetailsParams {
  titleLowered: string | undefined;
  sortBy: string;
  order: string;
}

export interface GenreDetailsResponse {
  genre: GenreInfo;
  songs: ApiResponse['songs'];
  page: number;
  limit: number;
  pageCount: number;
  totalCount: number;
}

// Artist Song Types
export interface ArtistSong extends Song {
  id: number;
  title: string;
  audioUrl: string;
  cover: string;
  duration: number;
  status: string;
  plays: number;
  artist: {
    id: number;
    username: string;
    fullName: string;
  };
  artistId: number;
  createdAt: string;
  updatedAt: string;
}

export interface UploadSongPayload {
  title: string;
  audioFile: File;
  coverFile: File;
  duration?: number;
}

export interface UpdateSongPayload {
  id: string;
  updates: {
    title?: string;
    cover?: File;
    audio?: File;
  };
}

export interface SongResponse {
  id: number;
  title: string;
  audioUrl: string;
  cover: string;
  duration: number;
  status: string;
  plays: number;
  artist: {
    id: number;
    username: string;
    fullName: string;
  };
  artistId: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteResponse {
  message: string;
  statusCode: number;
}
