import HeroBg from "../../../public/home/hero-bg.png";

// تصویر وسط (عکس داخل صفحه‌ی گرامافون)
import CenterArtist from "../../../public/home/hero4.png"; // ← اگر فایل دیگری داری جایگزین کن

// شش آرتیست دور گرامافون (مطابق چینش تصویر)
import Artist1 from "../../../public/home/hero1.png"; // بالا-چپ
import Artist2 from "../../../public/home/hero2.png"; // میانه-چپ
import Artist4 from "../../../public/home/hero3.png"; // بالا-راست
import Artist5 from "../../../public/home/hero5.png"; // میانه-راست
import Artist6 from "../../../public/home/hero6.png"; // پایین-راست
import Artist3 from "../../../public/home/hero7.png"; // پایین-چپ

const baseAvatar =
  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-xl " +
  "w-[86px] h-[86px] sm:w-[98px] sm:h-[98px] md:w-[128px] md:h-[128px]";

const Hero = () => {
  return (
    <section
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: `url(${HeroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* تصویر مرکزی داخل گرامافون */}
      <img
        src={CenterArtist}
        alt="center-artist"
        className="absolute left-1/2 top-[46%] sm:top-[47%] md:top-[47%] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-2xl
                   w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px]
                   ring-4 ring-[#ff6a00] ring-offset-2 ring-offset-black"
      />

      {/* دکمه‌ی See all روی مرکز صفحه */}
      <button
        className="absolute left-1/2 top-[63%] sm:top-[62%] md:top-[61%] -translate-x-1/2 -translate-y-1/2
                   bg-blue-600 text-white rounded-full px-5 py-2 sm:px-6 sm:py-2 md:px-7 md:py-2.5
                   shadow-md text-xs sm:text-sm md:text-base"
      >
        See all
      </button>

      {/* آرتیست‌های چپ (بالا/میانه/پایین) */}
      <img src={Artist1} alt="artist-1"
           className={`${baseAvatar} left-[20%] top-[22%] sm:left-[25%] sm:top-[23%] md:left-[27.5%] md:top-[24%]`} />
      <img src={Artist2} alt="artist-2"
           className={`${baseAvatar} left-[16%] top-[44%] sm:left-[22%] sm:top-[45%] md:left-[24%] md:top-[45%]`} />
      <img src={Artist3} alt="artist-3"
           className={`${baseAvatar} left-[23%] top-[66%] sm:left-[28%] sm:top-[66%] md:left-[30%] md:top-[67%]`} />

      {/* آرتیست‌های راست (بالا/میانه/پایین) */}
      <img src={Artist4} alt="artist-4"
           className={`${baseAvatar} left-[74%] top-[23%] sm:left-[67%] sm:top-[24%] md:left-[69.5%] md:top-[24%]`} />
      <img src={Artist5} alt="artist-5"
           className={`${baseAvatar} left-[83%] top-[44.5%] sm:left-[75%] sm:top-[45%] md:left-[77%] md:top-[45%]`} />
      <img src={Artist6} alt="artist-6"
           className={`${baseAvatar} left-[72%] top-[66%] sm:left-[65%] sm:top-[66%] md:left-[66.5%] md:top-[67%]`} />

      {/* متن پایین */}
      <p className="absolute bottom-6 text-white text-sm md:text-base text-center px-4">
        These artists are trending globally on Soundflow right now
      </p>
    </section>
  );
};

export default Hero;
