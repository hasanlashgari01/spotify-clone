import { Dispatch, SetStateAction } from "react";

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
export type GenreDetailsWrapperProps = {
  genreDetails: {
    cover: string;
    title: string;
    slug?: string;
  } | null;
  songs: any[];
  hours: number;
  minutes: number;
  seconds: number;
  isOwner?: boolean;
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
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
}
