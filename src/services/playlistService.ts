// services/playlistService.ts
import { httpService } from '../config/axios';
import { PlaylistSong, SongSortBy, SortOrder } from './playlistDetailsService';

export interface Playlist {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  cover: string;
  status: 'public' | 'private';
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  pageCount: number;
  totalCount: number;
}

export interface PlaylistResponse {
  playlists: Playlist[];
  pagination: Pagination;
}

export interface AddResponse {
  message: string;
  error?: string;
  statusCode?: number;
}

export interface DeleteResponse {
  message: string;
  error?: string;
  statusCode?: number;
  stat: 'success' | 'error';
}

export interface PlaylistSongsResponse {
  songs: PlaylistSong[];
  pagination: Pagination;
}

export const playlistService = {
  // لیست پلی‌لیست‌های من
  async getMyPlaylists(page = 1, limit = 10): Promise<PlaylistResponse> {
    const { data } = await httpService.get<PlaylistResponse>('/playlists/my', {
      params: { page, limit },
    });
    return data;
  },

  // افزودن آهنگ به پلی‌لیست
  async Addmusic(playlistId: string, songId: string) {
    try {
      const { data } = await httpService.patch<AddResponse>(
        `/playlists/${playlistId}/song/${songId}`
      );
      return data?.message;
    } catch (error) {
      console.error(error);
    }
  },

  // حذف آهنگ از پلی‌لیست
  async Deletemusic(playlistId: string, songId: string) {
    try {
      const { data } = await httpService.delete<DeleteResponse>(
        `/playlists/${playlistId}/song/${songId}`
      );
      // نرمال‌سازی stat
      const stat: DeleteResponse['stat'] = data.statusCode ? 'error' : 'success';
      return { ...data, stat };
    } catch (error) {
      console.error(error);
    }
  },

  // لایک/آنلایک پلی‌لیست
  async LikeorUnlike(playlistId: string) {
    try {
      const { data } = await httpService.get<AddResponse>(
        `/playlists/${playlistId}/toggle-like`
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  },

  // حذف پلی‌لیست
  async deletePlaylist(playlistId: string) {
    try {
      const { data } = await httpService.delete<DeleteResponse>(
        `/playlists/${playlistId}`
      );
      const stat: DeleteResponse['stat'] = data.statusCode ? 'error' : 'success';
      return { ...data, stat };
    } catch (error) {
      console.error(error);
      return { message: 'Failed to delete playlist', stat: 'error' as const };
    }
  },

  // لیست آهنگ‌های یک پلی‌لیست با صفحه‌بندی و سورت
  async getPlaylistSongs(
    slug: string,
    opts: { page?: number; limit?: number; sortBy?: SongSortBy; order?: SortOrder } = {}
  ): Promise<PlaylistSongsResponse> {
    const { data } = await httpService.get<PlaylistSongsResponse>(`/playlists/${slug}`, {
      params: {
        page: opts.page ?? 1,
        limit: opts.limit ?? 10,
        sortBy: opts.sortBy,
        order: opts.order,
      },
    });
    // گارد امن
    return {
      songs: Array.isArray((data as any)?.songs) ? data.songs : [],
      pagination: data?.pagination ?? { page: 1, limit: 0, pageCount: 0, totalCount: 0 },
    };
  },

  // جستجو داخل یک پلی‌لیست
  async Search(playlistId: string, q: string) {
    if (!playlistId || !q) {
      return { songs: [] as PlaylistSong[], pagination: { page: 1, limit: 0, pageCount: 0, totalCount: 0 } };
    }
    try {
      const { data } = await httpService.get<{ songs: PlaylistSong[]; }>(
        '/playlists/search',
        { params: { playlistId, q } }
      );
      console.log(data)
      return {
        songs: Array.isArray(data) ? data : [],

      };
    } catch (error) {
      console.error(error);
      return { songs: [] as PlaylistSong[], pagination: { page: 1, limit: 0, pageCount: 0, totalCount: 0 } };
    }
  },
};
