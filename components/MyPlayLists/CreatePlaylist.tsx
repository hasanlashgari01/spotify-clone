import { PiPlus } from 'react-icons/pi';
const CreatePlaylist = () => {
  return (
    <>
      <div className="flex cursor-pointer flex-col items-center overflow-hidden">
        <div className="relative flex h-[120px] w-[120px] items-center justify-center rounded-xl bg-gradient-to-br from-[#1574f5] via-[#1574f5]/0 to-transparent p-[2px] sm:h-[150px] sm:w-[150px] md:h-[210px] md:w-[210px]">
          <PiPlus color="white" size={100} />
        </div>
        <h3 className="mt-2 truncate text-center text-sm font-medium text-white sm:text-base">
          create playlist
        </h3>
      </div>
    </>
  );
};

export default CreatePlaylist;
