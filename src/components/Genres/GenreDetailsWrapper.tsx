import ErrorMessage from '../error/ErrorMessage';
import FloatingMusicIcons from '../playlistpage/FloatingMusicIcons';
import { FC } from 'react';
import { GenreDetailsWrapperProps } from '../../types/song.type';

const GenreDetailsWrapper: FC<GenreDetailsWrapperProps> = ({
  genreDetails,
}) => {
  if (!genreDetails) {
    return <ErrorMessage error={'Genre Not Found'} />;
  }

  return (
    <div className="relative mb-10 flex w-full flex-col md:flex-row">
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <FloatingMusicIcons />
      </div>

      <div className="block md:hidden">
        <div
          className="relative h-[50vh] w-full bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url(${genreDetails.cover || '/default.webp'})`,
          }}
        >
          <div className="absolute inset-0 backdrop-blur-[2px]" />

          <div className="relative z-10 flex h-full flex-col items-center justify-evenly p-8">
            <div className="group relative mt-4">
              <div className="absolute -inset-1 rounded-xl opacity-60 blur transition duration-500 group-hover:opacity-80"></div>
              <img
                src={genreDetails.cover || '/default.webp'}
                alt={genreDetails.title}
                className="relative h-32 w-32 rounded-xl object-cover shadow-xl ring-1 ring-white/20"
              />
            </div>
            <div className="mb-10 w-full text-center text-white">
              <div className="flex flex-col">
                <div className="flex justify-center">
                  <span className="mx-1 mt-5 text-2xl font-bold drop-shadow-lg text-white">
                    {genreDetails.title} Genre
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex md:flex-col md:items-start md:gap-6 md:p-5">
        <div className="flex md:flex-col md:items-center md:gap-8">
          <div className="group relative">
            <div className="absolute -inset-1 rounded-2xl bg-[#1574f5] opacity-75 blur transition duration-1000 group-hover:opacity-100"></div>
            <img
              src={genreDetails.cover || '/default.webp'}
              alt={genreDetails.title}
              className="relative h-60 w-60 rounded-2xl object-cover shadow-2xl ring-1 ring-white/10 sm:h-72 sm:w-72 md:h-80 md:w-80"
            />
          </div>

          <div className="mt-4 text-2xl font-bold text-white">
            {genreDetails.title} Genre
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreDetailsWrapper;
