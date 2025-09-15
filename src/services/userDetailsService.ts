import { httpService } from '../config/axios';

export interface Pagination {
  page: number;
  limit: number;
  pageCount: number;
  totalCount: number;
}
export interface Follower {
  id: number;
  fullName: string;
  role: string;
  avatar: string;
}
export interface Followers {
  id: number;
  followerId: number;
  follower: Follower;
  followingId: number;
  createdAt: string;
}
export interface Followings {
  id: number;
  followerId: number;
  followingId: number;
  following: Follower;
  createdAt: string;
}
export interface FollowerResponse {
  pagination: Pagination;
  followers: Followers[];
}
export interface FollowingResponse {
  pagination: Pagination;
  followings: Followings[];
}

export const getUserFollowers = async (
  id: string,
  page: number,
  limit: number
): Promise<FollowerResponse | null> => {
  try {
    const response = await httpService.get<FollowerResponse>(
      `/follow/${id}/followers?page=${page}&limit=${limit}`
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getUserFollowings = async (
  id: string,
  page: number,
  limit: number
): Promise<FollowingResponse | null> => {
  try {
    const response = await httpService.get<FollowingResponse>(
      `/follow/${id}/followings?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.log('Error Occured : ', error);
    return null;
  }
};
export const getFollowingCount = async (
  id: string,
  action: string
): Promise<number> => {
  const response = await httpService.get<number>(
    `/follow/${id}/${action}/count`
  );
  return response.data;
};
export const UserService = {
  async FollowUnFollow(id: number) {
    if (!id) return;
    try {
      const response = await httpService.get(`/follow/${id}`);
      return response.data.message;
    } catch (error) {
      console.error(error);
    }
  },
};
