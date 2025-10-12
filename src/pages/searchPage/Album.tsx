import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Play } from "lucide-react";
import artistImg from "../../../public/search/shadmehr.jpg";

const Album = () => {
  const Albums = [
    { id: 1, name: 'Shadmehr Aghili', img: artistImg },
    { id: 2, name: 'Ehsan Khajeh Amiri', img: artistImg },
    { id: 3, name: 'Mohammad Alizadeh', img: artistImg },
    { id: 4, name: 'Ebi', img: artistImg },
    { id: 5, name: 'Googoosh', img: artistImg },
    { id: 6, name: 'Dariush', img: artistImg },
    { id: 7, name: 'Hayedeh', img: artistImg },
    { id: 8, name: 'Googoosh', img: artistImg },
    { id: 9, name: 'Dariush', img: artistImg },
    { id: 10, name: 'Hayedeh', img: artistImg },
  ];

  return (
    <section className="w-full py-8 text-white">
      <h2 className="text-2xl font-bold mb-4 px-6">Albums</h2>

      <Swiper
        spaceBetween={20}
        slidesPerView="auto"
        breakpoints={{
          640: { slidesPerView: 2 }, // برای موبایل، نمایش ۲ آیتم
          768: { slidesPerView: 3 }, // برای تبلت، نمایش ۳ آیتم
          1024: { slidesPerView: 5 }, // برای دسکتاپ، نمایش ۵ آیتم
        }}
        className="px-6"
      >
        {Albums.map((album) => (
          <SwiperSlide key={album.id} className="!w-auto">
            <div className="relative h-56 w-48 rounded-lg px-8 py-4 bg-gray-800 hover:bg-gray-700 hover:shadow-xl transition-all duration-300">
              <img
                src={album.img}
                alt={album.name}
                className="mx-auto h-36 w-36 rounded-md object-cover"
              />
              <h3 className="mt-2 text-sm font-bold text-center truncate">{album.name}</h3>
              <h4 className="text-xs text-gray-400 text-center">Album</h4>
              {/* آیکون پلی در مرکز کارت */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="cursor-pointer rounded-full bg-green-500 p-3 text-center shadow-lg hover:scale-110 transition-all duration-300">
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
