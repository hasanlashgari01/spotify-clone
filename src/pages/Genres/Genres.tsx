import ErrorMessage from '../../components/error/ErrorMessage';
import Loading from '../../components/loading/Loading';
import { HeartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGenres } from './../../hooks/useFechSongs';

const Genres = () => {
  const { data: genres, isLoading, error } = useGenres();

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  return (
    <div className="min-h-[100vh] w-full bg-[linear-gradient(180deg,#1574F5_0%,#1453AB_16%,#13458A_35%,#112745_55%,#101721_75%,#101721_100%)]">
      <div className="bgColor height-auto flex min-h-screen items-center justify-evenly text-black">
        {genres?.map((genre) => (
          <div
            className="relative inline-flex w-[350px] flex-col rounded-[15px] bg-white font-light shadow-[0_0_100px_-10px_rgba(0,0,0,0.2)] transition-shadow hover:shadow-lg"
            key={genre.slug}
          >
            <Link
              to={`/genre/${genre.title.toLowerCase()}`}
              key={genre.id}
              className="no-underline"
            >
              <div className="h-[250px] w-full overflow-hidden rounded-t-[15px]">
                <img
                  src={genre.cover}
                  alt={`${genre.title} Cover`}
                  className="h-full w-full rounded-t-[15px] object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                />
              </div>
            </Link>
            <div className="flex min-h-[5vh] items-center justify-evenly px-4 py-2">
              <label className="truncate font-normal text-black">
                {genre.title}
              </label>
              <button className="p-1 text-[#fff`]">
                <HeartIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Genres;
