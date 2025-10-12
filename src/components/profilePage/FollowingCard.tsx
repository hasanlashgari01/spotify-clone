import FollowingSection from "./FollowingSection";
import LoadingCircle from "../loading/LoadingCircle";
import React, { useCallback, useEffect, useRef, useState } from "react";
import defAvatar from "../../../public/default-avatar.webp";
import { XIcon } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { useFollow } from "../../context/UserFansContext";
import { authService } from "../../services/authService";
import { UserService } from "../../services/userDetailsService";

// FollowingCard.tsx
import {
  getFollowingCount,
  Followings,
  getUserFollowings,
} from '../../services/userDetailsService'; 

interface FollowingCardProps {
  open?: boolean;
  onClose?: () => void;
}

const FollowingCard: React.FC<FollowingCardProps> = ({ open, onClose }) => {
  const isMobile = useMediaQuery({ maxWidth: 779 });
  
  const isDesktop = useMediaQuery({ minWidth: 1195 });

  const { followings, setFollowings , setCount } = useFollow();

  
  const [fCount, setFCount] = useState<number>(0);
  const [modal, setModal] = useState<boolean>(false);
  const isControlled = typeof open === 'boolean';
  const isOpen = isControlled ? !!open : modal;
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
    if (!isOpen) return;
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
  }, [isOpen, loading, page, totalPages]);
  
  
  const handleUnfollow = useCallback(async (id: number) => {
    const res = await UserService.FollowUnFollow(id);
    if (res === 200) {
      setFollowings(prev => prev.filter(item => item.following?.id !== id));
      setCount(prev => ({
        ...prev,
        followings: Math.max(0, prev.followings - 1),
      }));
    } else {
      return;
    }
  }, [setFollowings, setCount]);

  // In controlled mode, avoid occupying any layout space when closed
  if (isControlled && !isOpen) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-20 bg-transparent p-10">
     
      {isOpen && (
        <div
          className="fixed inset-0 z-10000 flex items-center justify-center bg-black/50"
          onClick={() => {
            if (isControlled) onClose?.(); else setModal(false)
          }}
        >
          <div
            className="relative flex max-h-[80vh] min-h-[80vh] w-[90%] max-w-[500px] flex-col gap-6 overflow-y-auto rounded-2xl bg-[#101721] p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row items-center justify-start">
              <h2 className="text-center text-2xl font-bold">Followings</h2>
              <div
                onClick={() => { if (isControlled) onClose?.(); else setModal(false) }}
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

      
      
    </div>
  );
};

export default FollowingCard;
