import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {

  CallbackResponse,
  UpdateSongPayload,
  UploadSongPayload,
  UserInfo,
  UserProfile,
} from '../types/song.type';

import {
  fetchSongByArtist,
  uploadSongByArtist,
  updateSongByArtist,
  deleteSongByArtist,
  updateUserProfileInfo,
  fetchUserProfile,
  toggleUserStatus,
  fetchTopTeen,
} from '../services/ArtistServicesApi';

// #1 fetch artist's songs
export const useFetchArtistSongs = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['artistSongs'],
    queryFn: fetchSongByArtist,
  });

  return { data, isLoading };
};

// #2 uplaod new song
export const useUploadSongs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (songData: UploadSongPayload) =>
      await uploadSongByArtist(songData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistSongs'] });
      toast.success(`Upload successful`);
    },
    onError: (error: any) => {
      toast.error(`Upload song failed ❌ ${error?.message || ''}`);
    },
  });
};

// #3 edit music
export const useUpdateSongs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateSongPayload) =>
      await updateSongByArtist(payload.id, payload.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistSongs'] });
      toast.success(`Update successful`);
    },
    onError: (error: any) => {
      toast.error(`update song failed ❌ ${error?.message || ''}`);
    },
  });
};

//#4 delete music
export const useDeleteSongs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => await deleteSongByArtist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artistSongs'] });
      toast.success(`delete successful`);
    },
    onError: (error: any) => {
      toast.error(`delete song failed ❌ ${error?.message || ''}`);
    },
  });
};

// #5 update user Profile Info
export const useUpdateUserInfo = () => {
  const queryClient = useQueryClient();
  return useMutation<CallbackResponse, Error, UserInfo>({
    mutationFn: async (payload: UserInfo) =>
      await updateUserProfileInfo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success(`update successful`);
    },
    onError: (error) => {
      toast.error(`update User Info failed ❌ ${error?.message || ''}`);
    },
  });
};

// #6 fetch user Profile
export const useFetchUserProfileInfo = () => {
  return useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });
};

// #7 fetch user status
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      toast.success(`status Updated successfully`);
    },
    onError: (error: any) => {
      toast.error(`update status failed ❌ ${error?.message || ''}`);
    },
  });
};
export const useArtistPopularSongs  = ( id : number , enabled : boolean) => {
  const { data  , isLoading } = useQuery({
    queryKey: ['topteen'],
    queryFn:() =>  fetchTopTeen(id),
    enabled,
  })
  console.log(id)

  return {data, isLoading}
}
