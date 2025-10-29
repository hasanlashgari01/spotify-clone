import ErrorMessage from '../error/ErrorMessage';
import Loading from '../loading/Loading';
import { Link } from 'react-router-dom';
import { useGenres } from '../../hooks/useFechSongs';
import { GenreItemsColors } from '../../services/ColorPalette';

const Genres = () => {
  const { data: genres, isLoading, error } = useGenres();

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  return (
    <div className="bgColor h-[100dvh]">
      <div className="grid grid-cols-1 gap-8 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {genres?.map((genre) => {
          const colorsKey = genre.title.toLowerCase().trim();
          const bgColor = GenreItemsColors[colorsKey];
          return (
            <Link
              to={`/genre/${genre.title.toLowerCase()}`}
              key={genre.id}
              className="no-underline"
            >
              <div
                key={genre?.id}
                className={`genres-start relative flex min-h-[150px] min-w-[210px] justify-start overflow-hidden rounded-xl p-4`}
                style={{ backgroundColor: bgColor }}
              >
                <span className="z-10 text-[1.5rem] font-semibold text-white">
                  {genre.title}
                </span>
                <img
                  src={genre.cover}
                  alt={genre.title}
                  className="absolute right-0 bottom-0 h-25 w-25 rotate-12 rounded-lg shadow-lg"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Genres;
