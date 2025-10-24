import { PlayIcon } from "lucide-react";

type Props = {
  img: string;
  title: string;
  year: string;
};

export const DiscoCard = ({ img, title, year }: Props) => {
  return (
    <div
      className="group flex cursor-pointer flex-col rounded-2xl
                 bg-gradient-to-b from-[#0a0f1f] to-[#001229]
                 p-4 shadow-[0_0_10px_rgba(0,40,255,0.15)]
                 transition-all duration-300
                 hover:scale-[1.015] hover:from-[#0c152c] hover:to-[#001a40]
                 hover:shadow-[0_0_18px_rgba(0,70,255,0.25)]"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={img}
          alt={title}
          className="h-60 w-full rounded-2xl object-cover transition-all duration-500 group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[rgba(0,0,40,0.6)] to-transparent opacity-60"></div>

        {/* Play button */}
        <div
          className="absolute bottom-[-5px] left-6/7 -translate-x-1/2 opacity-0
                     group-hover:bottom-[20px] group-hover:opacity-100
                     transition-all duration-500 ease-out"
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-800
                          rounded-full w-12 h-12 flex items-center justify-center
                          shadow-[0_0_15px_rgba(0,120,255,0.4)] hover:shadow-[0_0_25px_rgba(0,150,255,0.6)]
                          transition-all duration-300">
            <PlayIcon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Text Info */}
      <div className="mt-4 flex flex-col text-blue-100">
        <h2 className="text-lg font-semibold tracking-wide transition-all hover:text-blue-300">
          {title}
        </h2>
        <h3 className="text-sm text-blue-400 opacity-70">{year}</h3>
      </div>
    </div>
  );
};
