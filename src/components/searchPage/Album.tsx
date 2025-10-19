import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Play } from 'lucide-react';
import { searchService, SearchPlaylist } from '../../services/searchService';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

type AlbumProps = {
  query: string;
};

const Album = ({ query }: AlbumProps) => {
  const [albums, setAlbums] = useState<SearchPlaylist[]>([]);
  const [loading, setLoading] = useState(false);
  const { playSong } = useMusicPlayer();

  useEffect(() => {
    if (!query) return;
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const data = await searchService.search(query);
        setAlbums(data.playlists || []);
      } catch (error) {
        console.error('Error fetching albums:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, [query]);

  const handleAlbumPlay = async (album: SearchPlaylist) => {
    try {
      // Search for songs in this album/playlist
      const data = await searchService.search(album.title);
      if (data.songs.length > 0) {
        // Convert the first song to the format expected by the music player
        const firstSong = data.songs[0];
        const songForPlayer = {
          id: firstSong.id,
          title: firstSong.title,
          audioUrl: firstSong.audioUrl,
          cover: firstSong.cover,
          duration: firstSong.duration,
          artist: {
            fullName: firstSong.artist.fullName,
            username: firstSong.artist.username
          }
        };
        
        // Convert all songs to the format expected by the music player
        const songsForQueue = data.songs.map(song => ({
          id: song.id,
          title: song.title,
          audioUrl: song.audioUrl,
          cover: song.cover,
          duration: song.duration,
          artist: {
            fullName: song.artist.fullName,
            username: song.artist.username
          }
        }));
        
        // Play the first song and set the queue to all album songs
        playSong(songForPlayer, songsForQueue);
      }
    } catch (error) {
      console.error('Error playing album songs:', error);
    }
  };

  if (loading)
    return (
      <section className="w-full p-8 text-white">
        <h2 className="mb-4 px-6 text-2xl font-bold">Albums</h2>
        <p className="px-6 text-gray-400">Loading...</p>
      </section>
    );

  if (!albums.length)
    return (
      <section className="w-full p-8 text-white">
        <h2 className="mb-4 px-6 text-2xl font-bold">Albums</h2>
        <p className="px-6 text-gray-500">No albums found.</p>
      </section>
    );

  return (
    <section className="w-full p-8 text-white">
      <h2 className="mb-4 px-6 text-2xl font-bold">Albums</h2>

      <Swiper
        spaceBetween={20}
        slidesPerView="auto"
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
        className="px-6"
      >
        {albums.map((album) => (
          <SwiperSlide key={album.id} className="!w-auto">
            <div className="group relative h-56 w-48 rounded-lg bg-black/40 px-8 py-4 transition-all duration-300 hover:bg-gray-700 hover:shadow-xl">
              <img
                src={album.cover}
                alt={album.title}
                className="mx-auto h-36 w-36 rounded-md object-cover"
              />
              <h3 className="mt-2 truncate text-center text-sm font-bold">
                {album.title}
              </h3>
              <h4 className="text-center text-xs text-gray-400">
                {album.owner?.fullName || 'Album'}
              </h4>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div 
                  onClick={() => handleAlbumPlay(album)}
                  className="cursor-pointer rounded-full bg-green-500 p-3 text-center shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <Play className="text-2xl text-white" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Album;
