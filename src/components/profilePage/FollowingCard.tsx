// FollowingCard.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  getFollowingCount,
  Followings,
  getUserFollowings,
} from '../../services/userDetailsService'; 
import { authService } from '../../services/authService';
import defAvatar from '../../../public/default-avatar.webp';
import FollowingSection from './FollowingSection';
import { useMediaQuery } from 'react-responsive';
import LoadingCircle from '../loading/LoadingCircle';
import { useFollow } from '../../context/UserFansContext';
import { XIcon } from 'lucide-react';
import { UserService } from '../../services/userDetailsService';

const FollowingCard: React.FC = () => {
  const isMobile = useMediaQuery({ maxWidth: 779 });
  
  const isDesktop = useMediaQuery({ minWidth: 1195 });

  const { followings, setFollowings } = useFollow();

  
  const [fCount, setFCount] = useState<number>(0);
  const [modal, setModal] = useState<boolean>(false); 
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;
  const [loading, setLoading] = useState<boolean>(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

 
  const fetchFollowings = useCallback(async (p: number) => {
    if (p > totalPages) return;
    setLoading(true);
    try {
      const data = await authService.getUser();
      if (!data?.id) return;

      const [res, counter] = await Promise.all([
        getUserFollowings(String(data.id), p, limit),
        getFollowingCount(String(data.id), 'followings'),
      ]);

      
      setFollowings(prev => {
        const combined = [...prev, ...(res?.followings ?? [])];
        
        const map = new Map<number, Followings>();
        combined.forEach(item => {
          const key = item.following?.id ?? item.followingId ?? item.following?.id;
          if (typeof key === 'number') map.set(key, item);
        });
        return Array.from(map.values());
      });

      
      if (res?.pagination?.pageCount) setTotalPages(res.pagination.pageCount);

     
      setFCount(counter ?? 0);
    } catch (err) {
      console.error('fetchFollowings error', err);
    } finally {
      setLoading(false);
    }
  }, [limit, setFollowings, totalPages]);

  useEffect(() => {
    fetchFollowings(page);
 
  }, [fetchFollowings, page]);

  
  useEffect(() => {
    setFCount(followings.length);
  }, [followings]);


  useEffect(() => {
    if (!modal) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1 }
    );
    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [modal, loading, page, totalPages]);

  
  const handleUnfollow =  useCallback(async (id: number) => {
    const res = await UserService.FollowUnFollow(id);
    if (res === 200) {
        setFollowings(prev => prev.filter(item => item.following?.id !== id));
    }
    else {
      return;
    }
    
    
  }, [setFollowings]);

  return (
    <div className="flex flex-col items-center justify-center gap-20 bg-transparent p-10">
     
      {(modal === true) && (
        <div
          className="fixed inset-0 z-10000 flex items-center justify-center bg-black/50"
          onClick={() => setModal(false)}
        >
          <div
            className="relative flex max-h-[80vh] min-h-[80vh] w-[90%] max-w-[500px] flex-col gap-6 overflow-y-auto rounded-2xl bg-[#101721] p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row items-center justify-start">
              <h2 className="text-center text-2xl font-bold">Followings</h2>
              <div
                onClick={() => setModal(false)}
                className="ml-auto cursor-pointer rounded-2xl bg-red-600 p-1 transition-all hover:bg-red-700"
              >
                <XIcon color="white" />
              </div>
            </div>

            <div className="flex flex-col" style={{ maxHeight: '60vh', overflowY: 'auto', paddingBottom: '60px' }}>
              {followings.map((f) => (
                <table key={f.following.id} className="w-full">
                  <FollowingSection
                    avatar={f.following.avatar}
                    fullName={f.following.fullName}
                    userId={f.following.id}
                    onUnfollow={handleUnfollow}
                  />
                </table>
              ))}

              <div ref={loadMoreRef} className="col-span-3 py-4 text-center">
                {loading && <p>Loading more...</p>}
                {!loading && page >= totalPages && <p className="text-gray-400">No more followings</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      
      {isDesktop ? (
        <div className="w-content flex flex-col items-center gap-5">
        <div className="w-content flex flex-row items-start justify-start gap-6">
          <h2 className="text-[40px] text-white">Following</h2>
          {loading ? <LoadingCircle /> : <h2 className="text-[40px] font-bold text-blue-600">{fCount}+</h2>}
        </div>

        {followings.length > 0 && (
          <>
            <div className="flex flex-row">
              {followings.slice(0, 5).map((f) => (
                <img
                  key={f.following.id}
                  src={f.following.avatar ?? defAvatar}
                  alt={f.following.fullName}
                  className={`-ml-3 rounded-full border-3 border-blue-900 first:ml-0 ${isMobile ? 'h-12 w-12' : 'h-20 w-20'}`}
                  style={{ zIndex: followings.length }}
                />
              ))}
            </div>

            <div className="flex w-[20%] justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="h-8 w-10 rotate-90 transform cursor-pointer text-white"
                viewBox="0 0 16 16"
                onClick={() => setModal(true)}
              >
                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
              </svg>
            </div>
          </>
        )}
      </div>
      ) : (
        
        <div className="w-content flex flex-col items-center gap-5">
          <div className="w-content flex flex-row items-start justify-start gap-6">
            <h2 className="text-3xl text-white">Following</h2>
            {loading ? <LoadingCircle /> : <h2 className="text-3xl font-bold text-blue-600">{fCount}+</h2>}
          </div>

          {followings.length > 0 && (
            <>
              <div className="flex flex-row">
                {followings.slice(0, 5).map((f) => (
                  <img
                    key={f.following.id}
                    src={f.following.avatar ?? defAvatar}
                    alt={f.following.fullName}
                    className={`-ml-3 rounded-full border-3 border-blue-900 first:ml-0 ${isMobile ? 'h-12 w-12' : 'h-16 w-16'}`}
                    style={{ zIndex: followings.length }}
                  />
                ))}
              </div>

              <div className="flex w-[20%] justify-end">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="h-8 w-10 rotate-90 transform cursor-pointer text-white"
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
