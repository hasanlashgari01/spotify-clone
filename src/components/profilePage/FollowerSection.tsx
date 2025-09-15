import React, { useState } from 'react';
import defAvatar from '../../../public/default-avatar.webp';
import { Link } from 'react-router-dom';
import { UserService, getUserFollowings } from '../../services/userDetailsService';
import { getMe } from '../../services/meService';
import LoadingCircle from '../loading/LoadingCircle';
import { useFollow } from '../../context/UserFansContext';

interface FollowerProps {
  avatar?: string;
  fullName: string;
  userId: number;
}

const FollowerSection: React.FC<FollowerProps> = ({
  avatar,
  fullName,
  userId,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { followings, setFollowings } = useFollow();

  
  const isFollowing = followings.some(f => f.following?.id === userId);

  const fnunf = async (id: number): Promise<void> => {
    if (!id) return;
    try {
      setLoading(true);

      await UserService.FollowUnFollow(id);

     
      const res = await getMe();
      const data = await getUserFollowings(`${res.sub}`, 1, 1000000);
      setFollowings(data?.followings ? data.followings : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
          <div className="flex flex-col items-start justify-center">
            <Link to={`/profile/${fullName}`}>
              <h3 className="text-base font-semibold text-white">{fullName}</h3>
            </Link>
          </div>
        </td>
        <td className="flex justify-end">
          <button
            onClick={() => fnunf(userId)}
            disabled={loading}
            className="text-md w-content min-w-20 cursor-pointer rounded-xl border border-blue-950 bg-black p-2 transition-all hover:bg-gray-900"
          >
            {loading ? (
              <LoadingCircle />
            ) : isFollowing ? (
              <>Unfollow</>
            ) : (
              <>Follow</>
            )}
          </button>
        </td>
      </tr>
    </tbody>
  );
};

export default FollowerSection;
