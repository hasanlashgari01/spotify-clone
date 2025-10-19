import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Play } from 'lucide-react';
import { searchService, SearchArtist } from '../../services/searchService';
import { useMusicPlayer } from '../../context/MusicPlayerContext';

type ArtistProps = {
  query: string;
};

const Artist = ({ query }: ArtistProps) => {
  const [artists, setArtists] = useState<SearchArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const { playSong } = useMusicPlayer();

  useEffect(() => {
    if (!query) return;
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const data = await searchService.search(query);
        setArtists(data.artists || []);
      } catch (error) {
        console.error('Error fetching artists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, [query]);

  const handleArtistPlay = async (artist: SearchArtist) => {
    try {
      // Search for songs by this artist
      const data = await searchService.search(artist.fullName);
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
        
        // Play the first song and set the queue to all artist songs
        playSong(songForPlayer, songsForQueue);
      }
    } catch (error) {
      console.error('Error playing artist songs:', error);
    }
  };

  if (loading)
    return (
      <section className="w-full p-8 text-white">
        <h2 className="mb-4 px-6 text-2xl font-bold">Artists</h2>
        <p className="px-6 text-gray-400">Loading...</p>
      </section>
    );

  if (!artists.length)
    return (
      <section className="w-full p-8 text-white">
        <h2 className="mb-4 px-6 text-2xl font-bold">Artists</h2>
        <p className="px-6 text-gray-500">No artists found.</p>
      </section>
    );

  return (
    <section className="w-full p-8 text-white">
      <h2 className="mb-4 px-6 text-2xl font-bold">Artists</h2>

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
        {artists.map((artist, i) => (
          <SwiperSlide key={i} className="!w-auto">
            <div className="group relative h-60 w-48 transform cursor-pointer rounded-xl bg-black/40 p-4 shadow-lg transition-all duration-300 hover:bg-gray-700">
              <img
                src={artist.avatar}
                alt={artist.fullName}
                className="mx-auto mb-4 h-36 w-36 rounded-full object-cover"
              />
              <h3 className="truncate text-center text-sm font-semibold">
                {artist.fullName}
              </h3>
              <p className="text-center text-xs text-gray-400">Artist</p>
              <div className="absolute right-8 bottom-16 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <div 
                  onClick={() => handleArtistPlay(artist)}
                  className="cursor-pointer rounded-full bg-green-500 p-3 shadow-lg hover:scale-110"
                >
                  <Play className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Artist;
