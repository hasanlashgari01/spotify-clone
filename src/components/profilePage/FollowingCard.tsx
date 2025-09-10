import React, { useEffect, useState } from 'react';
import {
  getFollowingCount,
  Followings,
  getUserFollowings,
} from '../../services/userDetailsService';
import { authService } from '../../services/authService';
import defAvatar from '../../../public/default-avatar.webp';
import FollowingSection from './FollowingSection';
import { useMediaQuery } from 'react-responsive';
const FollowingCard = () => {
  const isMobile = useMediaQuery({ maxWidth: 779 });
  const isTablet = useMediaQuery({ minWidth: 780, maxWidth: 1194 });
  const isDesktop = useMediaQuery({ minWidth: 1195 });
  const [followings, setFollowings] = useState<Followings[]>([]);
  const [fCount, setFCount] = useState<number>(0);
  const [modal, setModal] = useState<Boolean | null>(null);
  useEffect(() => {
    const fetchFollo = async () => {
      try {
        const data = await authService.getUser();
        if (!data?.id) return;

        const [res, counter] = await Promise.all([
          getUserFollowings(String(data.id)),
          getFollowingCount(String(data.id), 'followings'),
        ]);

        setFollowings(res?.followings ?? []);
        setFCount(counter ?? 0);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFollo();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-20 bg-transparent p-10">
      {modal && followings.length > 0 && (
        <div
          className="fixed inset-0 z-10000 flex items-center justify-center bg-black/50"
          onClick={() => setModal(false)}
        >
          <div
            className="relative flex max-h-[80vh] w-[90%] max-w-[600px] flex-col gap-6 overflow-y-auto rounded-2xl bg-gray-800 p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-center text-2xl font-bold">Followings</h2>

            <div
              className="grid grid-cols-2 gap-6 overflow-y-auto sm:grid-cols-3"
              style={{ maxHeight: '60vh' }}
            >
              {followings.map((f, i) => (
                <FollowingSection
                  key={i}
                  avatar={f.following.avatar}
                  fullName={f.following.fullName}
                />
              ))}
            </div>

            <button
              onClick={() => setModal(false)}
              className="mt-4 cursor-pointer self-center rounded-xl bg-red-600 px-6 py-2 font-bold hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Desktop */}
      {isDesktop && (
        <div className="bg-[] flex h-60 w-300 flex-row items-center justify-start rounded-3xl border-4 border-blue-900 text-center">
          <div className="flex w-[30%] flex-col gap-5">
            <h2 className="text-5xl text-white">Following</h2>
            <h2 className="text-5xl font-bold text-blue-600">{fCount}+</h2>
          </div>

          {followings.length > 0 && (
            <>
              <div className="flex w-[50%] flex-row">
                {followings.slice(0, 5).map((f, i) => (
                  <img
                    key={i}
                    src={f.following.avatar ? f.following.avatar : defAvatar}
                    alt="maybe"
                    className={`-ml-5 h-35 w-35 rounded-[25px] border-3 border-blue-900 first:ml-0`}
                    style={{ zIndex: followings.length + i }}
                  />
                ))}
              </div>

              <div className="flex w-[20%] justify-end">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="h-10 w-20 cursor-pointer text-white"
                  viewBox="0 0 16 16"
                  onClick={() => setModal(true)}
                >
                  <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                </svg>
              </div>
            </>
          )}
        </div>
      )}

      
      {(isMobile || isTablet) && (
        <div className="w-content flex flex-col items-center gap-5">
          <div className="w-content flex flex-row items-start justify-start gap-6">
            <h2 className="text-3xl text-white">Following</h2>
            <h2 className="text-3xl font-bold text-blue-600">{fCount}+</h2>
          </div>

          {followings.length > 0 && (
            <>
              <div className="flex flex-row">
                {followings.slice(0, 5).map((f, i) => (
                  <img
                    key={i}
                    src={f.following.avatar ? f.following.avatar : defAvatar}
                    alt="maybe"
                    className={`-ml-3 rounded-full border-3 border-blue-900 first:ml-0 ${isMobile ? 'h-12 w-12' :'h-16 w-16'}`}
                    style={{ zIndex: followings.length + i }}
                  />
                ))}
              </div>

              <div className="flex w-[20%] justify-end">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="h-7 w-10 rotate-90 transform cursor-pointer text-white"
                  viewBox="0 0 16 16"
                  onClick={() => setModal(true)}
                >
                  <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                </svg>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FollowingCard;
