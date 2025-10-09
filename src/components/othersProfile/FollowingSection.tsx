import React, { useState } from 'react';
import defAvatar from '../../../public/default-avatar.webp';
import { Link } from 'react-router-dom';
import '../../styles/scroll.css';
import LoadingCircle from '../loading/LoadingCircle';
import { useFollow } from '../../context/UserFansContext';

interface FollowerProps {
  avatar: string;
  fullName: string;
  userId: number;
  onUnfollow?: (id: number) => void; 
  isFollowing?: boolean; // <-- add this prop to determine follow state
  onFollow?: (id: number) => void; // <-- optional follow handler
}

const FollowingSection: React.FC<FollowerProps> = ({
  avatar,
  fullName,
  userId,
  onUnfollow,
  isFollowing: isFollowingProp,
  
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(!!isFollowingProp);
  const { meId } = useFollow();
  // Sync with prop if it changes
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
        if (onUnfollow) {
          const maybePromise = onUnfollow(id);
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
    <tbody className='z-100'>
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
              <h3 className="text-sm sm:text-lg font-semibold text-white">{fullName}</h3>
            </Link>
          </div>
        </td>

        <td className="flex justify-end">
          {meId !== userId && (<button
            onClick={() => handleFollowToggle(userId)}
            disabled={loading}
            className={`cursor-pointer bg-black border border-blue-950 p-2 text-md rounded-xl transition-all hover:bg-gray-900 w-content disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <LoadingCircle />
            ) : (
              <>{isFollowing ? 'Unfollow' : 'Follow'}</>
            )}
          </button>)}
        </td>
      </tr>
    </tbody>
  );
};

export default FollowingSection;
