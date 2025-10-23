import {httpService} from '../config/axios.ts';
export interface DeleteResult {
  message: string;
  error?: string;
  statusCode?: number;
}
export const ArtistService = {
  async Deletemusic(id : string) {
    if (!id) return;
    try {
      const response = await httpService.delete<DeleteResult>(`/song/${id}`)
      return response.data;
    }
    catch (error) {console.log(error);}
  },
}