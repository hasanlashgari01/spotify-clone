import { authService, User } from '../../services/authService';
import { useEffect, useCallback, useState, useRef } from 'react';
import defAvatar from '../../../public/default-avatar.webp';

import '../../styles/userinfo.css';
import { getFollowingCount, getOthersDetails, getUserFollowings, UserService } from '../../services/userDetailsService';
import { useNavigate, useParams } from 'react-router-dom';
import { getMe } from '../../services/meService';
import LuxeLoader from '../loading/LuxeLoader';
import LoadingCircle from '../loading/LoadingCircle';


const OthersProfile = () => {

  const [userData, setUserData] = useState<User | null>(null);
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [followers , setFollowers] = useState<number>(0);
  const [followings , setFollowings] = useState<number>(0)
  const [loading, setLoading] = useState(true);
  const [followed , setFollowed] = useState<boolean>(false)
  const [meId, setMeId] = useState<string | null>(null);
  const [isFollowingAction, setIsFollowingAction] = useState<boolean>(false);

  const loadingRef = useRef(loading);
  loadingRef.current = loading;
  const fetchAll = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    try {
      const other = await getOthersDetails(`${username}`);
      setUserData(other);
      setPreviewImage(other?.avatar || null);
      if (authService.isAuthenticated()) {
        const me = await getMe();
        if (`${me.sub}` === `${other.id}`) {
          navigate('/profile', { replace: true });
          return;
        }
        setMeId(`${me.sub}`);
        const followRes = await getUserFollowings(`${me.sub}`, 1, 100000);
        const isFollowed = !!followRes?.followings?.some((f) => `${f.following?.id}` === `${other.id}`);
        setFollowed(isFollowed);
      } else {
        setMeId(null);
        setFollowed(false);
      }
      const [fos, fings] = await Promise.all([
        getFollowingCount(`${other.id}`, `followers`),
        getFollowingCount(`${other.id}`, `followings`),
      ]);
      setFollowers(fos);
      setFollowings(fings);
    } catch (error) {
      console.log('Error occurred:', error);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);
  const handleFollowUnfollow = async () => {
    try {
      if (isFollowingAction) return;
      setIsFollowingAction(true);
      const res = await UserService.FollowUnFollow(Number(userData?.id))
      if (res && res !== 200) {
        console.log("Server side or Client side Error Occured , Please try again later")
        return;
      }
      else {
        setFollowed((prev) => !prev)
        
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsFollowingAction(false);
    }
  }
  
  if (loading) {
    return (
      <div className="flex min-h-[100vh] w-full items-center justify-center bg-[linear-gradient(180deg,#1574F5_0%,#1453AB_16%,#13458A_35%,#112745_55%,#101721_75%,#101721_100%)]">
        <LuxeLoader />
      </div>
    );
  }

  return (
    <div className="relative z-1000 flex h-[220px] flex-col items-start justify-end overflow-hidden rounded-b bg-cover bg-center sm:h-[300px] md:h-[340px] lg:h-[390px]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#0b2e5a_0%,#0c2d4e_20%,#101d38_50%,#101721_100%)]" />

      <div className="relative z-10 flex min-w-full flex-col items-start border-b-1 border-gray-300 px-4 pt-26 pb-6 backdrop-blur-[2px] sm:px-6 sm:pt-24 md:px-8 md:pt-28 lg:px-10 lg:pt-32">
        <div className="flex w-full flex-col items-center pb-4 sm:items-start sm:pb-5">
          <div className="flex flex-col items-center pb-3 sm:items-start sm:pb-5">
            <div className="group relative">
              <div className="flex w-full flex-row items-start justify-center gap-2 pb-3 text-2xl text-white sm:justify-start sm:pb-6 sm:text-3xl md:text-4xl">
                <img
                  className="relative h-28 w-28 rounded-full object-cover ring-2 ring-white/10 transition sm:h-32 sm:w-32 md:h-40 md:w-40 lg:h-44 lg:w-44"
                  src={userData?.avatar || defAvatar}
                  alt="User avatar"
                />
                <div className="flex flex-col gap-9">
                  <span className="text-[16px]">Profile</span>
                  <div>
                    <span className="pl-4 text-[60px] font-extrabold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
                      {userData?.fullName ? userData.fullName : 'Nameless'}
                    </span>
                  </div>
                  <span className="text-[16px]"> {followers} Followers • {followings} Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {authService.isAuthenticated() && userData?.id !== meId && (
          <button
            onClick={handleFollowUnfollow}
            disabled={isFollowingAction}
            className={`ml-10 flex items-center justify-center gap-2 rounded-3xl border-1 border-white bg-gray-700 p-3 text-center text-white transition-all w-30 hover:bg-gray-600 ${isFollowingAction ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-disabled={isFollowingAction}
          >
            {isFollowingAction ? (
              <div className="h-5 w-5 flex items-center justify-center"><LoadingCircle /></div>
            ) : null}
            <span>{followed ? 'UnFollow' : 'Follow'}</span>
          </button>
        )}
      </div>
      
    </div>
  );
};

export default OthersProfile;

