import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { searchService, SearchPlaylist } from '../../services/searchService';
import { Link } from 'react-router-dom';

type AlbumProps = {
  query: string;
};

const Album = ({ query }: AlbumProps) => {
  const [albums, setAlbums] = useState<SearchPlaylist[]>([]);
  const [loading, setLoading] = useState(false);

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

  if (loading)
    return (
      <section className="w-full p-8 text-white">
        <h2 className="mb-4 px-6 text-2xl font-bold">Playlists</h2>
        <p className="px-6 text-gray-400">Loading...</p>
      </section>
    );

  if (!albums.length)
    return (
      <section className="w-full p-8 text-white">
        <h2 className="mb-4 px-6 text-2xl font-bold">Playlists</h2>
        <p className="px-6 text-gray-500">No Playlists found.</p>
      </section>
    );

  return (
    <section className="w-full p-8 text-white">
      <h2 className="mb-4 px-6 text-2xl font-bold">Playlists</h2>

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
            <Link to={`/playlist/${album.slug}`}>
            <div className="group relative h-56 w-48 cursor-pointer rounded-lg bg-black/40 px-8 py-4 transition-all duration-300 hover:bg-gray-700 hover:shadow-xl">
              <img
                src={album.cover || '/default.webp'}
                alt={album.title}
                className="mx-auto h-36 w-36 rounded-md object-cover"
              />
              <h3 className="mt-2 truncate text-center text-sm font-bold">
                {album.title}
              </h3>
              <h4 className="text-center text-xs text-gray-400">
                {album.owner?.fullName || 'Album'}
              </h4>
            </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Album;
