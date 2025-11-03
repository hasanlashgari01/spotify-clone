import React, { useState } from 'react';
import defAvatar from '../../../public/default-avatar.webp';
import { Link } from 'react-router-dom';
import LoadingCircle from '../loading/LoadingCircle';
import { useFollow } from '../../context/UserFansContext';

interface FollowerProps {
  avatar?: string;
  fullName: string;
  username : string,
  onClose : (()=>void) | undefined;
  userId: number;
  isFollowing?: boolean;
  onFollow?: (id: number) => void;
  onUnfollow?: (id: number) => void;
}

const FollowerSection: React.FC<FollowerProps> = ({
  avatar,
  fullName,
  username ,
  userId,
  onClose,
  isFollowing: isFollowingProp,
  onFollow,
  onUnfollow,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(!!isFollowingProp);
  const { meId } = useFollow();
  React.useEffect(() => {
    if (typeof isFollowingProp === 'boolean') setIsFollowing(isFollowingProp);
  }, [isFollowingProp]);

  const handleFollowToggle = async (id: number) => {
    if (!id || loading) return;
    setLoading(true);
    try {
      if (isFollowing) {
        if (onUnfollow) {
          const maybePromise = onUnfollow(id);
          await Promise.resolve(maybePromise as unknown);
        }
        setIsFollowing(false);
      } else {
        if (onFollow) {
          const maybePromise = onFollow(id);
          await Promise.resolve(maybePromise as unknown);
        }
        setIsFollowing(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <tbody className="z-1000">
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
            <Link to={`/profile/${username}`}>
              <h3 className="text-sm sm:text-lg font-semibold text-white " onClick={()=> {
                onClose?.()
              }}>{fullName}</h3>
            </Link>
          </div>
          {/* شسیشسیشیسش */}
        </td>
        <td className="flex justify-end">
          {meId !== userId && (
            <button
              onClick={() => handleFollowToggle(userId)}
              disabled={loading}
              className="text-md w-content min-w-20 cursor-pointer rounded-xl border border-blue-950 bg-black p-2 transition-all hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <LoadingCircle />
              ) : (
                <>{isFollowing ? 'Unfollow' : 'Follow'}</>
              )}
            </button>
          )}
        </td>
      </tr>
    </tbody>
  );
};

export default FollowerSection;
