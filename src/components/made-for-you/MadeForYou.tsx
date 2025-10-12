import "swiper/css";
import "swiper/css/navigation";
import LeftArrowIcon from "../icons/LeftArrowIcon";
import Loading from "../loading/Loading";
import RightArrowIcon from "../icons/RightArrowIcon";
import SongItem from "../song-item/SongItem";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAuth } from "../../hooks/useAuth";
import { useMadeForYouSongs } from "../../hooks/usePopularSongs";
import { Song } from "../../types/song.type";

const MadeForYou: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = useMadeForYouSongs();

  if (!isAuthenticated) return;

  return (
    <div
      className="relative mx-[20px] mt-[2402px] h-[340px] sm:mx-[64px] sm:h-[373px]"
      style={{
        background: 'linear-gradient(to bottom, #101720, #101720)',
        marginTop: '50px',
      }}
    >
      <div className="mb-[20px] flex items-center justify-between px-[20px] pt-6 sm:mb-[40px] sm:pr-[77px] sm:pl-[85px]">
        <h2 className="text-lg font-bold text-white sm:text-2xl">
          Made For You
        </h2>
        <button className="relative flex items-center justify-center rounded-full border-2 border-[#1574f5] px-2 py-1 text-xs text-[#1574f5] transition hover:bg-[#1574f5]/10 sm:px-3 sm:py-1.5 sm:text-sm">
          See more
        </button>
      </div>
      <button className="made-prev absolute top-[150px] left-2 sm:left-4 md:left-6 z-10 h-[36px] w-[36px] cursor-pointer rounded-full p-1 hover:bg-gray-800 sm:top-[180px] sm:h-[48px] sm:w-[48px] sm:p-2 hidden md:block">
        <LeftArrowIcon />
      </button>
      <button className="made-next absolute top-[150px] right-2 sm:right-4 md:right-6 z-10 h-[36px] w-[36px] cursor-pointer rounded-full p-1 hover:bg-gray-800 sm:top-[180px] sm:h-[48px] sm:w-[48px] sm:p-2 hidden md:block">
        <RightArrowIcon />
      </button>
      <div className="relative mt-[40px] mr-[20px] mb-[10px] ml-[20px] sm:mt-[50px] sm:mr-[75px] sm:mb-[21px] sm:ml-[75px]">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: '.made-next',
            prevEl: '.made-prev',
            enabled: true,
          }}
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1.5, spaceBetween: 10 },
            400: { slidesPerView: 2.5, spaceBetween: 12 },
            600: { slidesPerView: 2.3, spaceBetween: 15 },
            800: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
            1280: { slidesPerView: 5, spaceBetween: 20 },
            1440: { slidesPerView: 6, spaceBetween: 20 },
            1600: { slidesPerView: 7, spaceBetween: 20 },
          }}
          style={{ height: '240px', paddingBottom: '10px' }}
        >
          {isLoading ? (
            <Loading />
          ) : (
            data?.map((song: Song) => (
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

export default MadeForYou;