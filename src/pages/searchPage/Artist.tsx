import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Play } from "lucide-react";
import artistImg from "../../../public/search/shadmehr.jpg";

const Artist = () => {
  const Artists = [
    { id: 1, name: "Shadmehr Aghili", img: artistImg },
    { id: 2, name: "Ehsan Khajeh Amiri", img: artistImg },
    { id: 3, name: "Mohammad Alizadeh", img: artistImg },
    { id: 4, name: "Ebi", img: artistImg },
    { id: 5, name: "Googoosh", img: artistImg },
    { id: 6, name: "Dariush", img: artistImg },
    { id: 7, name: "Hayedeh", img: artistImg },
    { id: 8, name: "Sattar", img: artistImg },
    { id: 9, name: "Hayedeh", img: artistImg },
    { id: 10, name: "Sattar", img: artistImg },
  ];

  return (
    <section className="w-full p-8 text-white">
      <h2 className="text-2xl font-bold mb-4 px-6">Artists</h2>

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
        {Artists.map((artist) => (
          <SwiperSlide key={artist.id} className="!w-auto">
            <div className="relative w-48 h-60 rounded-xl bg-black/40 hover:bg-gray-700 transition-all duration-300 p-4 group cursor-pointer shadow-lg transform ">
              <img
                src={artist.img}
                alt={artist.name}
                className="w-36 h-36 mx-auto object-cover rounded-full mb-4"
              />
              <h3 className="text-sm font-semibold text-center truncate">{artist.name}</h3>
              <p className="text-xs text-gray-400 text-center">Artist</p>

              {/* دکمه پلی - نمایش در حالت Hover */}
              <div className="absolute bottom-16 right-8 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                <div className="bg-green-500 p-3 rounded-full shadow-lg hover:scale-110">
                  <Play className="text-white w-5 h-5" />
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
