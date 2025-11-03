import DefaultAvatar from '../../../../public/default.webp';

import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { playlistService } from '../../../services/playlistService.ts';
import { useState } from 'react';
type Props = {
  artist: string;
  title: string;
}
export const SingleArtMusic = ({artist , title} : Props) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const handleHeartClick = async () => {

    try {

      setIsLiking(true);
      const res = await playlistService.LikeorUnlike(`2`);

      if (res && res.statusCode) {
        console.log('Error Occurred:', res);
        return;
      }
      setIsLiked((prev) => !prev);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLiking(false);
    }
  };
  return (
    <div className="hover:bg-gray-800 p-2 cursor-pointer  transition-all rounded-2xl flex w-full">
      <div className="flex items-center justify-start gap-3 w-[80%]">
        <div >
          <img
            src={DefaultAvatar}
            alt=""
            className="h-18 w-18 rounded-2xl"
          />
        </div>
        <div>
          <h2 className="text-white text-md">{title}</h2>
          <h4 className="text-gray-500 text-sm">{artist}</h4>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 w-[20%]">
        <button
          onClick={handleHeartClick}
          disabled={isLiking}
          aria-disabled={isLiking}
          className={`group flex h-10 w-10 items-center justify-center rounded-full  backdrop-blur-sm transition-all  ${isLiking ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          {isLiked ? (
            <FaHeart className="text-lg text-red-500 transition-colors" />
          ) : (
            <FaRegHeart className="text-lg text-white transition-colors group-hover:text-red-400" />
          )}
        </button>


      </div>
    </div>
  );
}