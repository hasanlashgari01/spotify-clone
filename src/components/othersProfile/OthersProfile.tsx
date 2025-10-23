import { User } from '../../services/authService';
import defAvatar from '../../../public/default-avatar.webp';
import { motion } from 'framer-motion';
import '../../styles/userinfo.css';
import FollowersCard from './FollowerCard';
import FollowingCard from './FollowingCard';
import LoadingCircle from '../loading/LoadingCircle.tsx';
import TripleDotMenu from './modal/TripleDotMenu.tsx';
import {
  getFollowingCount,
  getOthersDetails,
  UserService,
} from '../../services/userDetailsService';
import { useFollow } from '../../context/UserFansContext.tsx';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
//شسیشسیشیشسیش

interface Count {
  followings: number;
  followers: number;
}

const OthersProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { followings } = useFollow();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingsOpen, setFollowingsOpen] = useState(false);

  // وضعیت follow محلی برای تغییر فوری UI
  const [isFollowed, setIsFollowed] = useState<boolean | undefined>(undefined);

  // --- Query: دریافت اطلاعات کاربر ---
  const { data: userData, isLoading: isUserLoading } = useQuery<User | null>({
    queryKey: ['user', username],
    queryFn: async () => {
      if (!username) return null;
      return await getOthersDetails(username);
    },
    staleTime: 60 * 1000,
  });

  // --- Query: دریافت تعداد فالوورها و فالووینگ‌ها ---
  const { data: countData } = useQuery<Count>({
    queryKey: ['userCounts', userData?.id],
    queryFn: async () => {
      if (!userData?.id) return { followers: 0, followings: 0 };
      const [followingsCount, followersCount] = await Promise.all([
        getFollowingCount(`${userData.id}`, 'followings'),
        getFollowingCount(`${userData.id}`, 'followers'),
      ]);
      return {
        followings: Number(followingsCount) || 0,
        followers: Number(followersCount) || 0,
      };
    },
    enabled: !!userData?.id,
  });

  // --- تنظیم state محلی follow با استفاده از context ---
  useEffect(() => {
    if (!userData) return;
    const followedState = followings.some(
      (f) => f.following.id === Number(userData.id)
    );
    setIsFollowed(followedState);
  }, [userData, followings]);

  // --- Mutation: Follow / Unfollow با optimistic update ---
  const followMutation = useMutation({
    mutationFn: async () => {
      if (!userData?.id) throw new Error('User ID missing');
      const res = await UserService.FollowUnFollow(Number(userData.id));
      if (res !== 200) throw new Error('Request failed');
      return res;
    },
    onMutate: async () => {
      // فوراً UI رو آپدیت کن
      setIsFollowed((prev) => (prev !== undefined ? !prev : undefined));

      if (userData?.id) {
        queryClient.setQueryData<Count>(['userCounts', userData.id], (old) => {
          if (!old) return { followers: 0, followings: 0 };
          return {
            ...old,
            followers: isFollowed
              ? Math.max(0, old.followers - 1)
              : old.followers + 1,
          };
        });
      }
    },
    onError: (err) => {
      console.error('Follow/Unfollow failed', err);
      // rollback
      setIsFollowed((prev) => (prev !== undefined ? !prev : undefined));
    },
    onSettled: async () => {
      if (!userData?.id) return;
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['userCounts', userData.id],
        }),
        queryClient.invalidateQueries({ queryKey: ['user', username] }),
        queryClient.invalidateQueries({ queryKey: ['followers', userData.id] }),
        queryClient.invalidateQueries({
          queryKey: ['followings', userData.id],
        }),
      ]);
    },
  });

  const previewImage: string = userData?.avatar ?? defAvatar;

  // --- Loading state ---
  if (isUserLoading)
    return (
      <div className="flex h-[300px] items-center justify-center text-white">
        <LoadingCircle />
      </div>
    );

  return (
    <div className="relative z-50 flex h-[290px] flex-col items-start justify-end overflow-hidden rounded-b-2xl bg-cover bg-center sm:h-[300px] md:h-[340px] lg:h-[390px]">
      <div className="pointer-events-none absolute inset-0 flex flex-row bg-[linear-gradient(135deg,#1a2c5b_0%,#0f1f3d_30%,#0a1628_60%,#050b14_100%)]" />

      <div className="flex w-[100vw] items-start justify-between">
        {/* --- User info --- */}
        <div>
          <div className="relative flex min-w-full flex-col items-start px-4 pt-26 pb-6 backdrop-blur-[2px] sm:px-6 sm:pt-24 md:px-8 md:pt-28 lg:px-10 lg:pt-32">
            <div className="flex w-full flex-col items-center pb-4 sm:items-start sm:pb-5">
              <div className="flex flex-col items-center pb-3 sm:items-start sm:pb-5">
                <div className="group relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-500/40 via-cyan-400/30 to-indigo-500/30 blur-lg" />
                  <img
                    className="relative h-28 w-28 rounded-full object-cover ring-2 ring-white/10 transition sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-44 lg:w-44"
                    src={previewImage}
                    alt="User avatar"
                  />
                </div>
                <div className="mt-5 flex w-full flex-col items-center justify-center pb-3 text-2xl text-white sm:mt-7 sm:flex-row sm:justify-center sm:pb-6 sm:text-3xl md:mt-8 md:text-4xl">
                  <span className="font-extrabold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                    {userData?.fullName ?? 'Name'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Stats and Buttons --- */}
        <div className="relative top-[30%] mr-5 flex h-fit flex-col items-start justify-center gap-2 rounded-2xl p-3 transition-all sm:top-[30%] sm:mr-5 sm:rounded-3xl sm:p-5 md:top-[20%] md:mr-5 md:p-10 lg:mr-15 lg:p-13">
          <motion.div
            className="relative flex gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent p-6 shadow-xl backdrop-blur-xl sm:gap-6 sm:p-6 md:gap-10 md:p-8 lg:gap-12 lg:p-15"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              type="button"
              onClick={() => {
                setFollowersOpen(true);
                if (userData?.id)
                  queryClient.invalidateQueries({
                    queryKey: ['followers', userData.id],
                  });
              }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex cursor-pointer flex-col items-center text-center"
            >
              <motion.h2
                className="bg-gradient-to-br from-blue-400 to-cyan-300 bg-clip-text text-2xl leading-none font-black text-transparent sm:text-3xl md:text-5xl lg:text-6xl"
                animate={{
                  textShadow: [
                    '0 0 15px rgba(59,130,246,0.4)',
                    '0 0 25px rgba(59,130,246,0.7)',
                    '0 0 15px rgba(59,130,246,0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {countData?.followers ?? 0}+
              </motion.h2>
              <h3 className="mt-1 text-xs font-medium text-gray-300 group-hover:text-white sm:text-sm md:text-lg lg:text-xl">
                Followers
              </h3>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => {
                setFollowingsOpen(true);
                if (userData?.id)
                  queryClient.invalidateQueries({
                    queryKey: ['followings', userData.id],
                  });
              }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex cursor-pointer flex-col items-center text-center"
            >
              <motion.h2
                className="bg-gradient-to-br from-blue-400 to-cyan-300 bg-clip-text text-2xl leading-none font-black text-transparent sm:text-3xl md:text-5xl lg:text-6xl"
                animate={{
                  textShadow: [
                    '0 0 15px rgba(59,130,246,0.4)',
                    '0 0 25px rgba(59,130,246,0.7)',
                    '0 0 15px rgba(59,130,246,0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {countData?.followings ?? 0}+
              </motion.h2>
              <h3 className="mt-1 text-xs font-medium text-gray-300 group-hover:text-white sm:text-sm md:text-lg lg:text-xl">
                Following
              </h3>
            </motion.button>
          </motion.div>

          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={
                !followMutation.isPending ? { scale: 1.05, y: -2 } : {}
              }
              whileTap={!followMutation.isPending ? { scale: 0.95 } : {}}
              onClick={() => followMutation.mutate()}
              disabled={isFollowed === undefined || followMutation.isPending}
              className={`flex cursor-pointer items-center gap-2 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent px-5 py-3 text-sm font-medium shadow-lg backdrop-blur-xl transition-all duration-200 ${
                followMutation.isPending
                  ? 'cursor-not-allowed text-gray-400 opacity-70'
                  : 'text-white hover:scale-[1.02]'
              }`}
            >
              {followMutation.isPending && (
                <span className="scale-90">
                  <LoadingCircle />
                </span>
              )}
              <span>
                {isFollowed === undefined
                  ? '...'
                  : followMutation.isPending
                    ? 'Wait...'
                    : isFollowed
                      ? 'Unfollow'
                      : 'Follow'}
              </span>
            </motion.button>

            <span
              className="cursor-pointer text-center text-[14px] text-white transition-all hover:text-gray-200/90"
              onClick={() => setMenuOpen(true)}
            >
              ● ● ●
            </span>
          </div>
        </div>
      </div>

      {/* --- Modals --- */}
      <div className="fixed">
        <FollowersCard
          open={followersOpen}
          onClose={() => setFollowersOpen(false)}
          id={userData?.id}
        />
        <FollowingCard
          open={followingsOpen}
          onClose={() => setFollowingsOpen(false)}
          id={userData?.id}
        />
	 <TripleDotMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          
          
        />
      </div>

    </div>
  );
};

export default OthersProfile;
