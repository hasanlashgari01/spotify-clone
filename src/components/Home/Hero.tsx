import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import HeroBg from "../../../public/home/hero-bg.png";
import mobileHeroBg from "../../../public/home/mobilehero-bg.png";
import CenterArtist from "../../../public/home/hero4.png";
import Artist1 from "../../../public/home/hero1.png";
import Artist2 from "../../../public/home/hero2.png";
import Artist3 from "../../../public/home/hero7.png";
import Artist4 from "../../../public/home/hero3.png";
import Artist5 from "../../../public/home/hero5.png";
import Artist6 from "../../../public/home/hero6.png";

const baseAvatar =
  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-xl w-[86px] h-[86px] sm:w-[98px] sm:h-[98px] md:w-[128px] md:h-[128px]";

// موقعیت دسکتاپ (خطی)
const desktopPositions = [
  { src: Artist1, alt: "artist-1", left: 35, top: 22 },
  { src: Artist2, alt: "artist-2", left: 30, top: 50 },
  { src: Artist3, alt: "artist-3", left: 35, top: 78 },
  { src: Artist4, alt: "artist-4", left: 65, top: 22 },
  { src: Artist5, alt: "artist-5", left: 70, top: 50 },
  { src: Artist6, alt: "artist-6", left: 65, top: 78 },
];

// موقعیت موبایل (دایره‌ای یا هر آرایه دلخواه خودت)
const mobilePositions = [
  { src: Artist1, alt: "artist-1", left: 50, top: 25 },
  { src: Artist2, alt: "artist-2", left: 15, top: 40 },
  { src: Artist3, alt: "artist-3", left: 85, top: 40 },
  { src: Artist4, alt: "artist-4", left: 15, top: 70 },
  { src: Artist5, alt: "artist-5", left: 85, top: 70 },
  { src: Artist6, alt: "artist-6", left: 50, top: 85 },
];

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // زیر md
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const positions = isMobile ? mobilePositions : desktopPositions;

  return (
    <section
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${isMobile ? mobileHeroBg : HeroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* تصویر مرکزی */}
      <motion.img
        src={CenterArtist}
        alt="center-artist"
        className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-2xl
                   w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px]
                   ring-4 ring-[#ff6a00] ring-offset-2 ring-offset-black"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* دکمه See all */}
      <button className="absolute left-1/2 top-[73%] -translate-x-1/2 -translate-y-1/2
                         bg-blue-600 text-white rounded-full px-5 py-2 sm:px-6 sm:py-2 md:px-7 md:py-2.5
                         shadow-md text-xs sm:text-sm md:text-base hover:scale-105 transition-transform">
        See all
      </button>

      {/* آرتیست‌ها */}
      {positions.map((artist) => (
        <motion.img
          key={artist.alt}
          src={artist.src}
          alt={artist.alt}
          className={baseAvatar}
          style={{ left: `${artist.left}%`, top: `${artist.top}%` }}
          whileHover={{
            scale: 1.2,
            rotate: [0, 5, -5, 0],
            boxShadow: "0 0 20px rgba(255,255,255,0.6)",
          }}
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      ))}

      {/* متن پایین */}
      <p className="absolute bottom-6 text-white text-sm md:text-base text-center px-4">
        These artists are trending globally on Soundflow right now
      </p>
    </section>
  );
};

export default Hero;
