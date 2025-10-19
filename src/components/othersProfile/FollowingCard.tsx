import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getUserFollowings,
  Followings,
  UserService,
} from '../../services/userDetailsService';
import FollowingSection from './FollowingSection';
import { XIcon } from 'lucide-react';
import { useFollow } from '../../context/UserFansContext';

interface FollowingCardProps {
  open?: boolean;
  onClose?: () => void;
  id: string | undefined;
}

const isUserFollowing = (userId: number, followings: Followings[]): boolean =>
  followings.some((f) => f.following?.id === userId);

const FollowingCard = ({ open, onClose, id }: FollowingCardProps) => {
  const { followings, setCount } = useFollow();
  const [ffollowings, setFFollowings] = useState<Followings[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const isControlled = typeof open === 'boolean';
  const isOpen = isControlled ? !!open : modal;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const limit = 10;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // --- Fetch Followings ---
  const fetchFollowings = useCallback(
    async (p: number) => {
      if (p > totalPages || !id) return;
      setLoading(true);
      try {
        const res = await getUserFollowings(String(id), p, limit);
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
    [id, totalPages]
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

  // --- Scroll lock ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // --- Close on Escape key ---
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isControlled) onClose?.();
        else setModal(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isControlled, onClose]);

  if (isControlled && !isOpen) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-20 bg-transparent p-10">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="followings-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => (isControlled ? onClose?.() : setModal(false))}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative mb-20 flex w-full max-w-[500px] flex-col gap-4 rounded-2xl bg-gradient-to-b from-[#101721] to-[#101721e6] p-6 text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -40, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 40, scale: 0.95, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 24,
                mass: 1.1,
              }}
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
                        username ={f.following.username}
                        userId={f.following.id}
                        isFollowing={isUserFollowing(f.following.id, followings)}
                        onClose={onClose}
                        onUnfollow={handleUnfollow}
                      />
                    </table>
                  ))
                ) : (
                  <div className="py-6 text-center text-gray-400">No followings yet</div>
                )}

                <div ref={loadMoreRef} className="py-4 text-center">
                  {loading && <p>Loading more...</p>}
                  {!loading && page >= totalPages && (
                    <p className="text-gray-400">No more followings</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FollowingCard;
