import { User } from '../../services/authService';
import { useEffect, useCallback, useState } from 'react';
import defAvatar from '../../../public/default-avatar.webp';
import '../../styles/userinfo.css';
import FollowersCard from './FollowerCard';
import FollowingCard from './FollowingCard';
import {
  getFollowingCount,
  getOthersDetails,
} from '../../services/userDetailsService';
import { useParams } from 'react-router-dom';
import TripleDotMenu from './modal/TripleDotMenu.tsx';

interface Count {
  followings: number;
  followers: number;
}
const OthersProfile = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { username } = useParams();
  const [count, setCount] = useState<Count>({ followers: 0, followings: 0 });
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingsOpen, setFollowingsOpen] = useState(false);
  const [menuOpen , setMenuOpen] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const data = await getOthersDetails(`${username}`);
      setUserData(data);

      // گرفتن تعداد follower و following برای کاربر مورد نظر
      const [followingsCount, followersCount] = await Promise.all([
        getFollowingCount(`${data.id}`, 'followings'),
        getFollowingCount(`${data.id}`, 'followers'),
      ]);

      setCount({
        followings: Number(followingsCount) || 0,
        followers: Number(followersCount) || 0,
      });

      setPreviewImage(data?.avatar || null);
    } catch {
      // error handled silently
    }
  }, [username]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);


  return (
    <div className="relative z-1000 flex h-[220px] flex-col items-start justify-end overflow-hidden rounded-b border-b-1 border-gray-300 bg-cover bg-center sm:h-[300px] md:h-[340px] lg:h-[390px]">
      <div className="pointer-events-none absolute inset-0 flex flex-row bg-[linear-gradient(180deg,#0b2e5a_0%,#0c2d4e_20%,#101d38_50%,#101721_100%)]" />

      <div className="flex w-[100vw] items-start justify-between">
        <div className="">
          <div className="relative z-10 flex min-w-full flex-col items-start px-4 pt-26 pb-6 backdrop-blur-[2px] sm:px-6 sm:pt-24 md:px-8 md:pt-28 lg:px-10 lg:pt-32">
            <div className="flex w-full flex-col items-center pb-4 sm:items-start sm:pb-5">
              <div className="flex flex-col items-center pb-3 sm:items-start sm:pb-5">
                <div className="group relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-500/40 via-cyan-400/30 to-indigo-500/30 blur-lg" />
                  <img
                    className="relative h-28 w-28 rounded-full object-cover ring-2 ring-white/10 transition sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-44 lg:w-44"
                    src={userData?.avatar || defAvatar}
                    alt="User avatar"
                  />
                </div>
                <div className="mt-5 flex w-full flex-row items-center justify-center gap-2 pb-3 text-center text-2xl text-white sm:justify-start sm:pb-6 sm:text-3xl md:text-4xl">
                  <span className="ml-13 text-center text-2xl font-extrabold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                    {userData?.fullName ? userData.fullName : 'Loading...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative top-[42%] mr-5 flex h-fit items-center justify-center gap-8 rounded-2xl border-1 border-gray-400 p-3 text-white transition-all sm:top-[30%] sm:mr-5 sm:rounded-3xl sm:p-5 md:mr-5 md:gap-20 md:p-10 lg:mr-15 lg:p-13">
          <button
            type="button"
            onClick={() => setFollowersOpen(true)}
            className="group flex cursor-pointer flex-col text-center select-none focus:outline-none"
            aria-label="Open followers list"
          >
            <h2 className="text-[15px] text-white transition-all group-hover:text-gray-300 sm:text-[30px] md:text-[35px] lg:text-[40px]">
              {count.followers}+
            </h2>
            <h3 className="text-sm transition-all group-hover:text-gray-300 sm:text-xl md:text-2xl lg:text-3xl">
              Followers
            </h3>
          </button>
          <button
            type="button"
            onClick={() => setFollowingsOpen(true)}
            className="group flex cursor-pointer flex-col text-center select-none focus:outline-none"
            aria-label="Open followings list"
          >
            <h2 className="text-[15px] text-white transition-all group-hover:text-gray-300 sm:text-[30px] md:text-[35px] lg:text-[40px]">
              {count.followings}+
            </h2>
            <h3 className="text-sm transition-all group-hover:text-gray-300 sm:text-xl md:text-2xl lg:text-3xl">
              Following
            </h3>
          </button>
          <div className="group hidden flex-col text-center select-none focus:outline-none sm:flex md:flex">
            <h2 className="text-[15px] text-white transition-all sm:text-[30px] md:text-[35px] lg:text-[40px]">
              25+
            </h2>
            <h3 className="text-sm transition-all sm:text-xl md:text-2xl lg:text-3xl">
              Playlists
            </h3>
          </div>
        </div>
      </div>
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
