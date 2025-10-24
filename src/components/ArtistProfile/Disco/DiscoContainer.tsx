import { DiscoCard } from './Disco-card.tsx';
import DefaultPicture from '../../../../public/default.webp';
import { useState } from 'react';

const items = [
  { title: "Popular Songs" },
  { title: "Albums" },
  { title: "Singles and EPs" },
];

export const DiscoContainer = () => {
  const [current, setCurrent] = useState<string>("Popular Songs");

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl bg-gradient-to-b from-[#0a0f1f] to-[#001229] p-6 sm:p-10 md:p-16 lg:p-20 shadow-[0_0_50px_rgba(0,40,255,0.2)]">
      {/* Header */}
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-white">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">Discography</h2>
        <button className="self-start sm:self-auto cursor-pointer rounded-full bg-blue-700 px-5 py-2 text-sm sm:text-base shadow-[0_0_15px_rgba(0,0,255,0.5)] transition-all duration-300 hover:bg-blue-800 hover:shadow-[0_0_25px_rgba(0,100,255,0.8)]">
          Show all
        </button>
      </div>

      {/* Tabs */}
      <div className="flex w-full flex-wrap items-center gap-3 text-sm text-blue-100">
        {items.map((item, index) => {
          const isActive = current === item.title;

          return (
            <div
              key={index}
              onClick={() => setCurrent(item.title)}
              className={`
                cursor-pointer rounded-full px-5 py-2 
                transition-all duration-300 select-none
                shadow-[inset_0_0_10px_rgba(0,100,255,0.4),0_0_15px_rgba(0,60,255,0.3)]
                ${isActive
                ? "bg-gradient-to-br from-[#153b8a] to-[#1a4db3] text-white shadow-[inset_0_0_15px_rgba(0,160,255,0.6),0_0_25px_rgba(0,100,255,0.5)] scale-105"
                : "bg-gradient-to-br from-[#0b1e40] to-[#0f2d6a] hover:scale-105 hover:from-[#133b89] hover:to-[#1a49a3] hover:shadow-[inset_0_0_15px_rgba(0,150,255,0.6),0_0_25px_rgba(0,80,255,0.5)]"
              }
              `}
            >
              {item.title}
            </div>
          );
        })}
      </div>

      {/* Cards Grid */}
      <div className="mt-6 grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 rounded-2xl bg-gradient-to-br from-[#0d1a33] to-[#071024] p-5 text-blue-200 shadow-inner shadow-blue-900">
        {Array.from(Array(5).keys()).map((_, index) => (
          <DiscoCard
            key={index}
            img={DefaultPicture}
            title={'Namahdod'}
            year={'Single - 2017'}
          />
        ))}
      </div>
    </div>
  );
};
