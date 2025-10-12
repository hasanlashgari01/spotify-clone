import { useQuery, useQueryClient } from "@tanstack/react-query";
import { httpService } from "../config/axios";

import {
  ApiResponse,
  GenreDetailsResponse,
  GenreInfo,
  UseGenreDetailsParams,
} from '../types/song.type';


// ^ fetch all genres
export const useGenres = () => {
  return useQuery<GenreInfo[], Error>({
    queryKey: ['genres'],
    queryFn: async () => {
      const { data } = await httpService.get<GenreInfo[]>('/genres');
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Cache genres for 5 minutes
  });
};

// ^ fetch genres  by id

export const useGenreDetails = ({
  titleLowered,
  sortBy,
  order,
}: UseGenreDetailsParams) => {
  const queryClient = useQueryClient();

  return useQuery<GenreDetailsResponse, Error>({
    queryKey: ['genreDetails', titleLowered, sortBy, order],
    enabled: !!titleLowered, // don’t fetch until we have a valid title
    queryFn: async () => {
      // 1️⃣ Try to use cached genres to avoid refetch
      const cachedGenres = queryClient.getQueryData<GenreInfo[]>(['genres']);
      const genres =
        cachedGenres ?? (await httpService.get<GenreInfo[]>('/genres')).data;

      // 2️⃣ Find the genre by lowered title
      const findGenre = genres.find(
        (g) => g.title.toLowerCase() === titleLowered
      );

      if (!findGenre?.id) {
        const error = new Error('Genre not found') as Error & { code?: string };
        error.code = 'GENRE_NOT_FOUND';
        throw error;
      }

      // 3️⃣ Fetch songs for that genre
      const { data } = await httpService.get<ApiResponse>(
        `/song/genre/${findGenre.id}`,
        {
          params: { sortBy, order },
        }
      );

      return {
        genre: findGenre,
        songs: data.songs,
      };
    },
    // keepPreviousData: true, // ✅ prevents UI flicker when sort/order changes
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
