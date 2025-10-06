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
