import { useEffect, useState, useRef, useCallback } from 'react';
import {  getUserFollowings, Followings, UserService } from '../../services/userDetailsService';
import FollowingSection from './FollowingSection';
import { XIcon } from 'lucide-react';
import { useFollow } from '../../context/UserFansContext';

interface FollowingCardProps {
  open?: boolean;
  onClose?: () => void;
  id: string | undefined;
}

// Helper: بررسی اینکه آیا کاربر دنبال شده
const isUserFollowing = (userId: number, followings: Followings[]): boolean =>
  followings.some((f) => f.following?.id === userId);

const FollowingCard = ({ open, onClose, id }: FollowingCardProps) => {
  const { followings,  setCount } = useFollow();
  const [ffollowings, setFFollowings] = useState<Followings[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const isControlled = typeof open === 'boolean';
  const isOpen = isControlled ? !!open : modal;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;
  const [loading, setLoading] = useState<boolean>(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // --- Fetch Followings ---
  const fetchFollowings = useCallback(
    async (p: number) => {
      if (p > totalPages || !id) return;
      setLoading(true);
      try {
        const [res] = await Promise.all([getUserFollowings(String(id), p, limit)]);
        setFFollowings((prev) => {
          const combined = [...prev, ...(res?.followings ?? [])];
          const map = new Map<number, Followings>();
          combined.forEach((item) => {
            const key = item.following?.id ?? item.followingId;
            if (typeof key === 'number') map.set(key, item);
          });
          return Array.from(map.values());
        });
        if (res?.pagination?.pageCount) setTotalPages(res.pagination.pageCount);
      } catch (err) {
        console.error('fetchFollowings error', err);
      } finally {
        setLoading(false);
      }
    },
    [id, limit, totalPages]
  );

  useEffect(() => {
    if (isOpen) fetchFollowings(page);
  }, [fetchFollowings, page, isOpen]);

  // --- Infinite scroll ---
  useEffect(() => {
    if (!isOpen) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          setPage((prev) => prev + 1);
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

  // --- Unfollow user ---
  const handleUnfollow = useCallback(
    async (userId: number) => {
      try {
        const res = await UserService.FollowUnFollow(userId);
        if (res === 200) {
          setFFollowings((prev) => prev.filter((f) => f.following.id !== userId));
          setCount((prev) => ({
            ...prev,
            followings: Math.max(0, (prev?.followings ?? 0) - 1),
          }));
        }
      } catch (error) {
        console.error('Follow/Unfollow error:', error);
      }
    },
    [setCount]
  );

  if (isControlled && !isOpen) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-20 bg-transparent p-10">
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => (isControlled ? onClose?.() : setModal(false))}
        >
          <div
            className="relative flex max-h-[80vh] min-h-[80vh] w-[90%] max-w-[500px] flex-col gap-6 overflow-y-auto rounded-2xl bg-[#101721] p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row items-center justify-start">
              <h2 className="text-center text-2xl font-bold">Followings</h2>
              <div
                onClick={() => (isControlled ? onClose?.() : setModal(false))}
                className="ml-auto cursor-pointer rounded-2xl bg-red-600 p-1 hover:bg-red-700"
              >
                <XIcon color="white" />
              </div>
            </div>

            <div
              className="flex flex-col"
              style={{ maxHeight: '60vh', overflowY: 'auto', paddingBottom: '60px' }}
            >
              {ffollowings.length > 0 ? (
                ffollowings.map((f) => (
                  <table key={f.following.id} className="w-full">
                    <FollowingSection
                      avatar={f.following.avatar}
                      fullName={f.following.fullName}
                      userId={f.following.id}
                      isFollowing={isUserFollowing(f.following.id, followings)}
                      onUnfollow={handleUnfollow}
                    />
                  </table>
                ))
              ) : (
                <div className="py-6 text-center text-gray-400">No followings yet</div>
              )}

              <div ref={loadMoreRef} className="py-4 text-center">
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
