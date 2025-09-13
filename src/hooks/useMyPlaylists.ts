import { useQuery } from '@tanstack/react-query';
import { playlistService, PlaylistResponse } from '../services/playlistService';

export const useMyPlaylists = (page = 1, limit = 10) => {
  return useQuery<PlaylistResponse, Error>({
    queryKey: ['my-playlists', page, limit],
    queryFn: () => playlistService.getMyPlaylists(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};
