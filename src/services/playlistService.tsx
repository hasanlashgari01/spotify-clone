import axios from "axios";

const API_URL = "https://spotify-music.liara.run";

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
}

// get user playlist
export async function getMyPlaylists(): Promise<Playlist[]> {
  const res = await axios.get(`${API_URL}/playlists/my`);
  return res.data;
}

// create playlist
export async function createPlaylist(data: { name: string; description?: string }) {
  const res = await axios.post(`${API_URL}/playlists`, data);
  return res.data;
}
