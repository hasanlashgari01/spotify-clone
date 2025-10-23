import { httpService } from "../config/axios";

import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

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
    staleTime: 5 * 60 * 1000,
  });
};

// ^ fetch genres  by id
export const useGenreDetails = ({
  titleLowered,
  sortBy,
  order,
}: UseGenreDetailsParams) => {
  const queryClient = useQueryClient();

  return useInfiniteQuery<GenreDetailsResponse, Error>({
    queryKey: ['genreDetails', titleLowered, sortBy, order],
    enabled: !!titleLowered,
    queryFn: async ({ pageParam = 1 }) => {
      // #1 Try to use cached genres to avoid refetch
      const cachedGenres = queryClient.getQueryData<GenreInfo[]>(['genres']);
      const genres =
        cachedGenres ?? (await httpService.get<GenreInfo[]>('/genres')).data;

      // #2 Find the genre by lowered title
      const findGenre = genres.find(
        (genre) => genre.title.toLowerCase() === titleLowered
      );

      if (!findGenre?.id) {
        const error = new Error('Genre not found') as Error & { code?: string };
        error.code = 'GENRE_NOT_FOUND';
        throw error;
      }

      // #3 Fetch songs for that genre
      const { data } = await httpService.get<ApiResponse>(
        `/song/genre/${findGenre.id}`,
        {
          params: { sortBy, order, page: pageParam, limit: 10 },
        }
      );

      return {
        genre: findGenre,
        songs: data.songs ,
        pagination: data.pagination,
      } as GenreDetailsResponse;
    },
    // #4 pagination function
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.pageCount) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
