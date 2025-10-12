import { useQuery } from '@tanstack/react-query';
import { httpService } from '../config/axios';
import { GenreInfo } from '../types/song.type';

export const useGenres = () => {
  return useQuery<GenreInfo[], Error>({
    queryKey: ['genres'],
    queryFn: async () => {
      const { data } = await httpService.get<GenreInfo[]>('/genres');
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};
