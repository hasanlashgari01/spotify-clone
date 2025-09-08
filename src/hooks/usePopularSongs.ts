import { useQuery } from '@tanstack/react-query';
import { songService } from '../services/songService';
import { Song } from '../types/song.type';

export const usePopularSongs = () => {
  return useQuery<Song[], Error>({
    queryKey: ['popular-songs'],
    queryFn: songService.getPopularSongs,
    staleTime: 5 * 60 * 1000,
  });
};

export const useNewSongs = () => {
  return useQuery<Song[], Error>({
    queryKey: ['new-songs'],
    queryFn: songService.getNewSongs,
    staleTime: 5 * 60 * 1000,
  });
};