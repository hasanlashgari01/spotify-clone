import { httpService } from '../config/axios';

export interface Playlist {
  id: number;
  title: string;
  slug: string;
  description: string;
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
  stat: string;
}

export const playlistService = {
  async getMyPlaylists(page = 1, limit = 10): Promise<PlaylistResponse> {
    const { data } = await httpService.get<PlaylistResponse>('/playlists/my', {
      params: { page, limit },
    });
    
    return data;
    
  },
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
  async Deletemusic(playlistId: string, songId: string) {
    try {
      const { data } = await httpService.delete<DeleteResponse>(
        `/playlists/${playlistId}/song/${songId}`
      );
      if (data.statusCode) data.stat = 'error';
      if (!data.statusCode) data.stat = 'success';
      return data;
    } catch (error) {
      console.error(error);
    }
  },
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
  async deletePlaylist(playlistId: string) {
    try {
      const { data } = await httpService.delete<DeleteResponse>(
        `/playlists/${playlistId}`
      );
      if (data.statusCode) data.stat = 'error';
      if (!data.statusCode) data.stat = 'success';
      return data;
    } catch (error) {
      console.error(error);
      return { message: 'Failed to delete playlist', stat: 'error' };
    }
  },
  
};
