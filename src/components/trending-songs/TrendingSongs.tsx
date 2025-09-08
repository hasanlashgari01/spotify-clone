import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { usePopularSongs } from '../../hooks/usePopularSongs';
import Error from '../error/ErrorMessage';
import Loading from '../loading/Loading';
import SongItem from '../song-item/SongItem';
import LeftArrowIcon from '../icons/LeftArrowIcon';
import RightArrowIcon from '../icons/RightArrowIcon';

const TrendingSongs: React.FC = () => {
  const { data, isLoading, error } = usePopularSongs();

  if (error) return <Error {...error} />;

  return (
    <div className="relative mx-[20px] h-[300px] bg-[#101720] sm:mx-[64px] sm:h-[333px]">
      <div className="mb-[20px] flex items-center justify-between px-[20px] sm:mb-[40px] sm:pr-[77px] sm:pl-[85px]">
        <h2 className="text-lg font-bold text-white sm:text-2xl">
          Trending songs
        </h2>
        <button className="relative flex items-center justify-center rounded-full border-2 border-[#1574f5] px-2 py-1 text-xs text-[#1574f5] transition hover:bg-[#1574f5]/10 sm:px-3 sm:py-1.5 sm:text-sm">
          See more
        </button>
      </div>
      <button className="trending-prev absolute top-[120px] left-0 z-10 h-[36px] w-[36px] cursor-pointer rounded-full p-1 hover:bg-gray-800 sm:top-[150px] sm:h-[48px] sm:w-[48px] sm:p-2">
        <LeftArrowIcon />
      </button>
      <button className="trending-next absolute top-[120px] right-0 z-10 h-[36px] w-[36px] cursor-pointer rounded-full p-1 hover:bg-gray-800 sm:top-[150px] sm:h-[48px] sm:w-[48px] sm:p-2">
        <RightArrowIcon />
      </button>
      <div className="relative mt-[30px] mr-[20px] mb-[10px] ml-[20px] sm:mt-[40px] sm:mr-[75px] sm:mb-[21px] sm:ml-[75px]">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: '.trending-next',
            prevEl: '.trending-prev',
            enabled: true,
          }}
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 1.5, spaceBetween: 10 },
            480: { slidesPerView: 2, spaceBetween: 15 },
            640: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
            1440: { slidesPerView: 6, spaceBetween: 20 },
            1600: { slidesPerView: 7, spaceBetween: 20 },
          }}
          style={{ height: '240px', paddingBottom: '10px' }}
        >
          {isLoading ? (
            <Loading />
          ) : (
            data?.map((song) => (
              <SwiperSlide
                key={song.id}
                style={{ width: '150px', height: '240px' }}
              >
                <SongItem {...song} />
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default TrendingSongs;