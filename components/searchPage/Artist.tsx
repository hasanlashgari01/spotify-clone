import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { searchService, SearchArtist } from '../../services/searchService';
import { Link } from 'react-router-dom';

type ArtistProps = {
  query: string;
};

const Artist = ({ query }: ArtistProps) => {
  const [artists, setArtists] = useState<SearchArtist[]>([]);
  const [loading, setLoading] = useState(false);

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
            <Link to={`/profile/${artist.username}`}>
            <div className="group relative h-60 w-48 transform cursor-pointer rounded-xl bg-black/40 p-4 shadow-lg transition-all duration-300 hover:bg-gray-700">
              <img
                src={artist.avatar|| "/default-avatar.webp"}
                alt={artist.fullName}
                className="mx-auto mb-4 h-36 w-36 rounded-full object-cover"
              />
              <h3 className="truncate text-center text-sm font-semibold">
                {artist.fullName}
              </h3>
              <p className="text-center text-xs text-gray-400">Artist</p>
            </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Artist;
