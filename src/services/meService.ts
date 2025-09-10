import { httpService } from "../config/axios";

export interface MeResponse {
  sub: number;
  email: string;
  role: string;
  isBan: boolean;
  status: string;
}

export const getMe = async (): Promise<MeResponse> => {
  const { data } = await httpService.get<MeResponse>("/auth/me");
  return data;
};