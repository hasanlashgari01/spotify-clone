import { httpService, publicService } from '../config/axios';
import { ApiError } from '../types/error.types';
import { Song  , AllSongs} from '../types/song.type';

export const songService = {
  async getPopularSongs(): Promise<Song[]> {
    try {
      const response = await httpService<Song[]>('song/popular-songs');
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.message || 'Failed to fetch popular songs'
      );
    }
  },
  async getAllSongs(page: number, limit: number): Promise<AllSongs> {
    try {
      
      const response = await httpService.get(`/song?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.response?.data?.message || 'Failed to fetch all songs');
    }
  },
  async getNewSongs(): Promise<Song[]> {
    try {
      const response = await httpService<Song[]>('song/new-songs');
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.message || 'Failed to fetch new songs'
      );
    }
  },
  
  async getMadeForYouSongs(): Promise<Song[]> {
    try {
      const response = await publicService<Song[]>('/song/made-for-you'); // استفاده از publicService
      return response.data;
    } catch (error: unknown) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.message || 'Failed to fetch made for you songs'
      );
    }
  },
  async getMySongs(): Promise<Song[]> {
    try {
      const response = await publicService<Song[]>('/song/my');
      return response.data;
    }
    catch (error: unknown) {
      const apiError = error as ApiError;
      throw new Error(
        apiError.response?.data?.message || 'Failed to fetch made for you songs'
      );
    }
  }
};
