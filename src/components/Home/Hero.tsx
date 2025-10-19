import CenterArtist from '../../../public/home/hero4.png'; // تصویر وسط

// شش آرتیست دور گرامافون
import Artist1 from '../../../public/home/hero1.png'; // بالا-چپ
import Artist2 from '../../../public/home/hero2.png'; // میانه-چپ
import Artist4 from '../../../public/home/hero3.png'; // بالا-راست
import Artist5 from '../../../public/home/hero5.png'; // میانه-راست
import Artist6 from '../../../public/home/hero6.png'; // پایین-راست
import Artist3 from '../../../public/home/hero7.png'; // پایین-چپ

// بک‌گراندها
import HeroBgMobile from '../../../public/home/hero-bg-mobile.png';
import HeroBgDesktop from '../../../public/home/hero-bg.png';

// استایل پایه‌ی آواتارها
const baseAvatar =
  'absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-xl ' +
  'w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] md:w-[110px] md:h-[110px] lg:w-[128px] lg:h-[128px] xl:w-[140px] xl:h-[140px] ' +
  'transition-transform duration-500 hover:scale-110 hover:rotate-3 hover:shadow-2xl pulse-animation';

const Hero = () => {
  return (
    <section className="relative flex h-[60dvh] w-full items-center justify-center overflow-hidden sm:h-[70dvh] md:h-[85dvh] lg:h-[90dvh] xl:h-[95dvh]">
      {/* بک‌گراند موبایل */}
      <div
        className="absolute inset-0 block bg-cover bg-center md:hidden"
        style={{ backgroundImage: `url(${HeroBgMobile})` }}
      ></div>

      {/* بک‌گراند دسکتاپ */}
      <div
        className="absolute inset-0 hidden bg-cover bg-center md:block"
        style={{ backgroundImage: `url(${HeroBgDesktop})` }}
      ></div>

      {/* تصویر مرکزی داخل گرامافون */}
      <img
        src={CenterArtist}
        alt="center-artist"
        className="absolute top-[50%] left-1/2 h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-2xl ring-4 ring-[#ff6a00] ring-offset-2 ring-offset-black sm:top-[48%] sm:h-[130px] sm:w-[130px] md:top-[47%] md:h-[160px] md:w-[160px] lg:h-[180px] lg:w-[180px] xl:h-[200px] xl:w-[200px]"
      />

      {/* دکمه‌ی See all روی مرکز صفحه */}
      <button className="absolute top-[72%] left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-4 py-1.5 text-xs text-white shadow-md sm:top-[65%] sm:px-6 sm:py-2 sm:text-sm md:top-[63%] md:px-7 md:py-2.5 md:text-base lg:top-[62%] xl:top-[70%]">
        See all
      </button>

      {/* آرتیست‌های چپ (بالا/میانه/پایین) */}
      <img
        src={Artist1}
        alt="artist-1"
        className={`${baseAvatar} top-[25%] left-[22%] sm:top-[23%] sm:left-[25%] md:top-[24%] md:left-[27%] lg:top-[24%] lg:left-[28%] xl:top-[21%] xl:left-[32%]`}
      />
      <img
        src={Artist2}
        alt="artist-2"
        className={`${baseAvatar} top-[50%] left-[15%] sm:top-[45%] sm:left-[21%] md:top-[45%] md:left-[24%] lg:top-[45%] lg:left-[25%] xl:top-[45%] xl:left-[28%]`}
      />
      <img
        src={Artist3}
        alt="artist-3"
        className={`${baseAvatar} top-[75%] left-[22%] sm:top-[67%] sm:left-[28%] md:top-[67%] md:left-[30%] lg:top-[68%] lg:left-[31%] xl:top-[70%] xl:left-[32%]`}
      />

      {/* آرتیست‌های راست (بالا/میانه/پایین) */}
      <img
        src={Artist4}
        alt="artist-4"
        className={`${baseAvatar} top-[25%] left-[78%] sm:top-[24%] sm:left-[70%] md:top-[24%] md:left-[71%] lg:top-[24%] lg:left-[72%] xl:top-[21%] xl:left-[68%]`}
      />
      <img
        src={Artist5}
        alt="artist-5"
        className={`${baseAvatar} top-[50%] left-[87%] sm:top-[45%] sm:left-[76%] md:top-[45%] md:left-[77%] lg:top-[45%] lg:left-[78%] xl:top-[45%] xl:left-[72%]`}
      />
      <img
        src={Artist6}
        alt="artist-6"
        className={`${baseAvatar} top-[75%] left-[78%] sm:top-[67%] sm:left-[66%] md:top-[67%] md:left-[67%] lg:top-[68%] lg:left-[68%] xl:top-[70%] xl:left-[68%]`}
      />

      {/* متن پایین */}
      <p className="absolute bottom-4 px-4 text-center text-xs text-white sm:text-sm md:text-base lg:bottom-6">
        These artists are trending globally on Soundflow right now
      </p>
    </section>
  );
};

export default Hero;
