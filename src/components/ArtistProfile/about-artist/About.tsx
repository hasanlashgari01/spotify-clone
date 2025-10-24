import DefaultPicture from '../../../../public/default-avatar.webp';

export const AboutArtist = () => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-[#0a0f1f] to-[#001229] p-10 sm:p-16 md:p-20 shadow-[0_0_40px_rgba(0,60,255,0.2)] flex flex-col justify-start items-start gap-8">

      {/* Title */}
      <h2 className="shineIt text-3xl">
        About
      </h2>




      {/* Content box */}
      <div className="w-250 flex flex-col gap-8 rounded-2xl bg-gradient-to-br from-[#0d1a33] to-[#071024] p-10 shadow-inner shadow-blue-900 transition-all duration-500 hover:from-[#12254d] hover:to-[#0b1939]">

        {/* Avatar */}
        <div className="flex justify-start">
          <img
            src={DefaultPicture}
            alt="Artist"
            className="h-48 w-48 sm:h-56 sm:w-56 rounded-full border-[3px] border-blue-700 shadow-[0_0_25px_rgba(0,80,255,0.5)] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_35px_rgba(0,120,255,0.6)]"
          />
        </div>

        {/* Description */}
        <div className="text-blue-200 leading-relaxed tracking-wide text-sm sm:text-base opacity-90">
          <p>
            anjsbfhksbdvlhbdflvhkbsdkjfbvlsidflvisbd fljh siufbnvuo lahds hv
            skiydgfgbv;o sdfhvis hdb fbgubk sehdb sbkdufhbi fgily bslh
            anjsbfhksbdvlhbdflvhkbsdkjfbvlsidflvisbd fljh siufbnvuo lahds hv
            skiydgfgbv;o sdfhvis hdb fbgubk sehdb sbkdufhbi fgily bslh
            anjsbfhksbdvlhbdflvhkbsdkjfbvlsidflvisbd fljh siufbnvuo lahds hv
            skiydgfgbv;o sdfhvis hdb fbgubk sehdb sbkdufhbi fgily bslh
          </p>
        </div>
      </div>
    </div>
  );
};
