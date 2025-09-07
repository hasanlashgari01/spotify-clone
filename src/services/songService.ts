import { httpService, publicService } from '../config/axios';
import { Song } from '../types/song.type';

export const songService = {
  async getPopularSongs(): Promise<Song[]> {
    try {
      const response = await httpService<Song[]>("song/popular-songs");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch popular songs");
    }
  },
  async getNewSongs(): Promise<Song[]> {
    try {
      const response = await httpService<Song[]>("song/new-songs");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch new songs");
    }
  },
 async getMadeForYouSongs(): Promise<Song[]> {
    try {
      const response = await publicService<Song[]>("/song/made-for-you"); // استفاده از publicService
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch made for you songs");
    }
  },
};