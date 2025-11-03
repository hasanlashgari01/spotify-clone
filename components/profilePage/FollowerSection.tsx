import LoadingCircle from '../loading/LoadingCircle';
import React, { useState } from 'react';
import defAvatar from '../../../public/default-avatar.webp';
import { Link } from 'react-router-dom';
import { Followings, UserService } from '../../services/userDetailsService';
import { useFollow } from '../../context/UserFansContext';

interface FollowerProps {
  avatar: string;
  fullName: string;
  username: string;
  createdAt: string;
  role: string;
  onClose?: () => void;
  userId: number;
}
// asdasdadadsad
const FollowerSection: React.FC<FollowerProps> = ({
  avatar,
  fullName,
  role,
  createdAt,
  username,
  onClose,
  userId,
}) => {
  const [loading, setLoading] = useState(false);
  const { followings, setFollowings, setCount } = useFollow();

  // Check if this follower is in the followings list
  const isFollowing = followings.some((f) => f.following?.id === userId);

  const toggleFollow = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await UserService.FollowUnFollow(userId);
      if (response === 200) {
        if (isFollowing) {
          // Remove from followings state
          setFollowings((prev) => prev.filter((f) => f.following?.id !== userId));
          setCount((prev) => ({
            ...prev,
            followings: Math.max(0, (prev?.followings ?? 0) - 1),
          }));
        } else {
          // Add to followings manually without refetching
          const newFollow: Followings = {
            id: Date.now(), // temporary UI ID
            followerId: -1, // placeholder
            followingId: userId,
            following: {
              id: userId,
              avatar,
              role,
              fullName,
              username,
            },
            createdAt,
          };

          setFollowings((prev) => [...prev, newFollow]);
          setCount((prev) => ({
            ...prev,
            followings: (prev?.followings ?? 0) + 1,
          }));
        }
      }
    } catch (error) {
      console.error('Toggle follow error:', error);
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
            <Link
              to={`/profile/${username}`}
              onClick={() => {
                onClose?.();
              }}
            >
              <h3 className="text-sm sm:text-lg font-semibold text-white">{fullName}</h3>
            </Link>
          </div>
        </td>

        <td className="flex justify-end">
          <button
            onClick={toggleFollow}
            disabled={loading}
            className="text-md w-content min-w-20 cursor-pointer rounded-xl border border-blue-950 bg-black p-2 transition-all hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <LoadingCircle /> : isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </td>
      </tr>
    </tbody>
  );
};

export default FollowerSection;
