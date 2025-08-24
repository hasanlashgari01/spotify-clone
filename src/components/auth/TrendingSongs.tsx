import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import  "swiper/css";
import "swiper/css/navigation";
import { usePopularSongs } from "../../hooks/usePopularSongs";
import { Link } from "react-router-dom";
import PlayIcon from "../icons/PlayIcon";
import PauseIcon from "../icons/PauseIcon";

const TrendingSongs = () => {
  const { data: songs = [], isLoading, error } = usePopularSongs();
  const [currentPlayingId, setCurrentPlayingId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px] sm:h-[333px] bg-[#101720] mt-[842px] mx-[20px] sm:mx-[64px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="h-[300px] sm:h-[333px] bg-[#101720] mt-[842px] mx-[20px] sm:mx-[64px] text-red-500 flex items-center justify-center">
        Error loading trending songs: {error.message}
      </div>
    );
  }

  const displayedSongs = songs;

  const handlePlayClick = (songId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentPlayingId === songId) {
      setCurrentPlayingId(null);
    } else {
      setCurrentPlayingId(songId);
    }
  };

  return (
    <div className="relative bg-[#101720] mt-[842px] mx-[20px] sm:mx-[64px] h-[300px] sm:h-[333px]">
      <div className="flex justify-between items-center px-[20px] sm:pl-[85px] sm:pr-[77px] mb-[20px] sm:mb-[40px]">
        <h2 className="text-lg sm:text-2xl font-bold text-white">
          Trending songs
        </h2>
        <button
          onClick={() => console.log("See more clicked!")}
          className="relative flex items-center justify-center text-[#1574f5] text-xs sm:text-sm border-2 border-[#1574f5] rounded-full px-2 sm:px-3 py-1 sm:py-1.5 hover:bg-[#1574f5]/10 transition"
        >
          See more
        </button>
      </div>
      <button className="custom-prev absolute left-0 top-[120px] sm:top-[150px] z-10 w-[36px] sm:w-[48px] h-[36px] sm:h-[48px] p-1 sm:p-2">
        <img
          src="/next.png"
          alt="Previous"
          className="w-4 sm:w-6 h-4 sm:h-6 transform rotate-180"
        />
      </button>
      <button className="custom-next absolute right-0 top-[120px] sm:top-[150px] z-10 w-[36px] sm:w-[48px] h-[36px] sm:h-[48px] p-1 sm:p-2">
        <img src="/next.png" alt="Next" className="w-4 sm:w-6 h-4 sm:h-6" />
      </button>
      <div className="relative ml-[20px] mr-[20px] sm:ml-[75px] sm:mr-[75px] mb-[10px] sm:mb-[21px] mt-[30px] sm:mt-[40px]">
        <Swiper
          modules={[Navigation]}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
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
          style={{ height: "240px", paddingBottom: "10px" }}
        >
          {displayedSongs.map((song, index) => (
            <SwiperSlide
              key={`${song.id}-${index}`}
              style={{ width: "150px", height: "240px" }}
            >
              <Link
                to={`/profile/${song.artist?.username || "unknown"}`}
                className="flex flex-col items-center w-full h-full group relative overflow-hidden"
              >
                <div className="relative w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[170px] md:h-[170px] rounded-xl p-[2px] bg-gradient-to-b from-[#1574f5] to-transparent">
                  <div className="w-full h-full rounded-xl overflow-hidden">
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-200" // تغییر از 75 به 90
                    />
                  </div>
                  
                  {/* آیکون play/pause در سمت راست پایین */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div 
                      className="w-8 h-8 bg-[#1DB954] rounded-full p-2 hover:scale-105 transition-transform flex items-center justify-center"
                      onClick={(e) => handlePlayClick(song.id, e)}
                    >
                      {currentPlayingId === song.id ? (
                        <PauseIcon />
                      ) : (
                        <PlayIcon />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* عنوان آهنگ */}
                <h3 className="text-white font-medium mt-2 text-sm sm:text-base truncate w-full text-center">
                  {song.title}
                </h3>
                
                {/* نام آرتیست */}
                <p className="text-gray-400 text-xs mt-1 truncate w-full text-center">
                  {song.artist?.fullName || song.artist?.username || `Artist ${song.artistId}`}
                </p>

                {/* هاور کارت: افکت روشن‌تر با opacity کمتر */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div> {/* تغییر از 50 به 20 */}
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TrendingSongs;