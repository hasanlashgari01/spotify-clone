import React, { useState } from 'react';
import defAvatar from '../../../public/default-avatar.webp';
import { Link } from 'react-router-dom';
import '../../styles/scroll.css';
import LoadingCircle from '../loading/LoadingCircle';

interface FollowerProps {
  avatar: string;
  fullName: string;
  userId: number;
  onUnfollow?: (id: number) => void; 
}

const FollowingSection: React.FC<FollowerProps> = ({ avatar, fullName, userId, onUnfollow }) => {
  const [loading , setLoading] = useState<boolean>(false);
  const fnunf = async (id: number) => {
    if (!id) return;
    try {
      setLoading(true)
      

      
      if (onUnfollow) {
        onUnfollow(id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      
    }
  };

  return (
    <tbody>
      <tr className="song-tableRow border-b border-gray-700 transition hover:bg-gray-800/40">
        <td className="w-16">
          <img
            src={avatar || defAvatar}
            className="h-12 w-12 rounded-lg object-cover"
            alt={fullName}
          />
        </td>

        <td>
          <div className="flex flex-col items-start justify-center w-20 sm:w-60">
            <Link to={`/profile/${userId}`}>
              <h3 className="text-base font-semibold text-white">{fullName}</h3>
            </Link>
          </div>
        </td>

        <td className="flex justify-end">
          <button
            onClick={() => fnunf(userId)}
            className="cursor-pointer bg-black border border-blue-950 p-2 text-md rounded-xl transition-all hover:bg-gray-900 min-w-20 w-content"
          >
            {loading ? <LoadingCircle/> : <>Unfollow</>}
          </button>
        </td>
      </tr>
    </tbody>
  );
};

export default FollowingSection;
