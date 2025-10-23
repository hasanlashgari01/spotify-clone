import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playlistService } from '../services/playlistService';
import { useAuth } from './useAuth';

export const useDeletePlaylist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (playlistId: number) => {
      // Additional client-side check (server should also validate)
      if (!user) {
        throw new Error('User must be authenticated to delete playlists');
      }
      return playlistService.deletePlaylist(playlistId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-playlists'] });
      queryClient.invalidateQueries({ queryKey: ['playlist-details'] });
    },
    onError: (error) => {
      console.error('Failed to delete playlist:', error);
    },
  });
};


