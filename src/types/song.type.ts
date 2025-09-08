export interface Song {
  id: number;
  title: string;
  audioUrl: string;
  cover: string;
  duration: number;
  status: string;
  plays: number;
  artistId: number;
  artist: {
    id: number;
    username: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}
