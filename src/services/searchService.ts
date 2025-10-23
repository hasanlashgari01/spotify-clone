import { httpService } from '../config/axios';

export type SearchSong = {
  id: number;
  title: string;
  audioUrl: string;
  cover: string;
  duration: number;
  status: string;
  artist: {
    username: string;
    fullName: string;
  };
};

export type SearchPlaylist = {
  id: number;
  title: string;
  slug: string;
  cover: string;
  status: string;
  owner: {
    fullName: string;
  };
};

export type SearchArtist = {
  username: string;
  fullName: string;
  avatar: string;
};

export type SearchUser = {
  username: string;
  fullName: string;
  avatar: string;
};

export type SearchResponse = {
  songs: SearchSong[];
  playlists: SearchPlaylist[];
  users: SearchUser[];
  artists: SearchArtist[];
};

export const searchService = {
  async search(query: string, page = 1): Promise<SearchResponse> {
    const { data } = await httpService.get<SearchResponse>('/search', {
      params: { q: query, page },
    });
    return data;
  },
};
