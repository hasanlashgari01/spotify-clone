import { useEffect, useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  getUserFollowers,
  getUserFollowings,
  Followers,
  Followings,
  UserService,
} from '../../services/userDetailsService';
import { authService } from '../../services/authService';
import FollowerSection from './FollowerSection';
import { XIcon } from 'lucide-react';
import { useFollow } from '../../context/UserFansContext';

interface FollowersCardProps {
  open?: boolean;
  onClose?: () => void;
  id: string | undefined;
}

// Helper: check if current user follows another user
const isUserFollowing = (userId: number, followings: Followings[]): boolean =>
  followings.some((f) => f.following?.id === userId);

const FollowersCard = ({ open, onClose, id }: FollowersCardProps) => {
  const { followings, setFollowings, setCount } = useFollow();
  const [ffollowers, setFFollowers] = useState<Followers[]>([]);
  const [modal, setModal] = useState<boolean>(false);
  const isControlled = typeof open === 'boolean';
  const isOpen = isControlled ? !!open : modal;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const limit = 10;
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchFollowers = useCallback(
    async (p: number) => {
      if (p > totalPages || !id) return;
      setLoading(true);
      try {
        const res = await getUserFollowers(String(id), p, limit);
        setFFollowers((prev) => {
          const combined = [...prev, ...(res?.followers ?? [])];
          const map = new Map<number, Followers>();
          combined.forEach((item) => {
            const key = item.follower?.id ?? item.followerId;
            if (typeof key === 'number') map.set(key, item);
          });
          return Array.from(map.values());
        });

        if (res?.pagination?.pageCount) {
          setTotalPages(res.pagination.pageCount);
        }
      } catch (err) {
        console.error('fetchFollowers error', err);
      } finally {
        setLoading(false);
      }
    },
    [id, totalPages]
  );

  useEffect(() => {
    if (isOpen) fetchFollowers(page);
  }, [fetchFollowers, page, isOpen]);

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

  // Scroll lock
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

  const handleFollowToggle = useCallback(
    async (userId: number) => {
      try {
        const isFollowing = isUserFollowing(userId, followings);
        const res = await UserService.FollowUnFollow(userId);
        if (res === 200) {
          if (isFollowing) {
            setFollowings((prev) => prev.filter((f) => f.following.id !== userId));
            setCount((prev) => ({
              ...prev,
              followings: Math.max(0, (prev?.followings ?? 0) - 1),
            }));
          } else {
            const me = await authService.getUser();
            if (!me?.id) return;
            const data = await getUserFollowings(`${me.id}`, 1, 1000000);
            setFollowings(data?.followings ?? []);
            setCount((prev) => ({
              ...prev,
              followings: (prev?.followings ?? 0) + 1,
            }));
          }
        }
      } catch (error) {
        console.error('Follow/Unfollow error:', error);
      }
    },
    [followings, setFollowings, setCount]
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isControlled) onClose?.();
        else setModal(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose, isControlled]);

  if (isControlled && !isOpen) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-20 bg-transparent p-10">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="followers-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={() => (isControlled ? onClose?.() : setModal(false))}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ cursor: 'pointer' }}
          >
            <motion.div
              className="relative mb-20 flex w-full max-w-120 flex-col gap-4 rounded-2xl bg-gradient-to-b from-[#101721] to-[#101721e6] p-6 text-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -40, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 40, scale: 0.95, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 24,
                mass: 1.1,
                duration: 0.35,
              }}
              style={{ cursor: 'default' }}
            >
              <div className="flex flex-row items-center justify-start">
                <h2 className="text-center text-2xl font-bold">Followers</h2>
                <div
                  onClick={() => (isControlled ? onClose?.() : setModal(false))}
                  className="ml-auto cursor-pointer rounded-2xl bg-red-600 p-1 transition-all hover:bg-red-700"
                >
                  <XIcon color="white" />
                </div>
              </div>

              <div
                className="flex flex-col"
                style={{ maxHeight: '60vh', overflowY: 'auto', paddingBottom: '60px' }}
              >
                {ffollowers.length > 0 ? (
                  ffollowers.map((f) => (
                    <table key={f.follower.id} className="w-full">
                      <FollowerSection
                        avatar={f.follower.avatar}
                        fullName={f.follower.fullName}
                        username = {f.follower.username}
                        onClose = {onClose}
                        userId={f.follower.id}
                        isFollowing={isUserFollowing(f.follower.id, followings)}
                        onFollow={handleFollowToggle}
                        onUnfollow={handleFollowToggle}
                      />
                    </table>
                  ))
                ) : (
                  <div className="py-6 text-center text-gray-400">No followers yet</div>
                )}

                <div ref={loadMoreRef} className="col-span-3 py-4 text-center">
                  {loading && <p>Loading more...</p>}
                  {!loading && page >= totalPages && (
                    <p className="text-gray-400">No more followers</p>
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

export default FollowersCard;
