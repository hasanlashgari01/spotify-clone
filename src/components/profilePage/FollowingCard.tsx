import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  getFollowingCount,
  Followings,
  getUserFollowings,
} from '../../services/userDetailsService';
import { authService } from '../../services/authService';

import FollowingSection from './FollowingSection';

import { useFollow } from '../../context/UserFansContext';
import { XIcon } from 'lucide-react';
import { UserService } from '../../services/userDetailsService';
// asdasdasdads
interface FollowingCardProps {
  open?: boolean;
  onClose?: () => void;
}

const FollowingCard: React.FC<FollowingCardProps> = ({ open, onClose }) => {
  const { followings, setFollowings, setCount } = useFollow();

  const [, setFCount] = useState<number>(0);
  const [modal, setModal] = useState<boolean>(false);
  const isControlled = typeof open === 'boolean';
  const isOpen = isControlled ? !!open : modal;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;
  const [loading, setLoading] = useState<boolean>(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchFollowings = useCallback(
    async (p: number) => {
      if (p > totalPages) return;
      setLoading(true);
      try {
        const data = await authService.getUser();
        if (!data?.id) return;

        const [res, counter] = await Promise.all([
          getUserFollowings(String(data.id), p, limit),
          getFollowingCount(String(data.id), 'followings'),
        ]);

        setFollowings((prev) => {
          const combined = [...prev, ...(res?.followings ?? [])];

          const map = new Map<number, Followings>();
          combined.forEach((item) => {
            const key =
              item.following?.id ?? item.followingId ?? item.following?.id;
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
    },
    [limit, setFollowings, totalPages]
  );

  useEffect(() => {
    if (!isOpen) return;
    fetchFollowings(page);
  }, [fetchFollowings, page, isOpen]);
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


  useEffect(() => {
    setFCount(followings.length);
  }, [followings]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

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

  const handleUnfollow = useCallback(
    async (id: number) => {
      const res = await UserService.FollowUnFollow(id);
      if (res === 200) {
        setFollowings((prev) => prev.filter((item) => item.following?.id !== id));
        setCount((prev) => ({
          ...prev,
          followings: Math.max(0, prev.followings - 1),
        }));
      } else {
        return;
      }
    },
    [setFollowings, setCount]
  );

  // Controlled mode: render nothing if closed
  if (isControlled && !isOpen) return null;

  return (
    <div className="flex flex-col  items-center justify-center gap-20 bg-transparent p-10">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="following-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={() => {
              if (isControlled) {
                onClose?.();
              } else {
                setModal(false);
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            aria-modal="true"
            role="dialog"
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
                <h2 className="text-center text-2xl font-bold">Followings</h2>
                <div
                  onClick={() => {
                    if (isControlled) onClose?.();
                    else setModal(false);
                  }}
                  className="ml-auto cursor-pointer rounded-2xl bg-red-600 p-1 transition-all hover:bg-red-700"
                >
                  <XIcon color="white" />
                </div>
              </div>

              <div
                className="flex flex-col"
                style={{ maxHeight: '60vh', overflowY: 'auto', paddingBottom: '60px' }}
              >
                {followings.map((f) => (
                  <table key={f.following.id} className="w-full">
                    <FollowingSection
                      avatar={f.following.avatar}
                      fullName={f.following.fullName}
                      username={f.following.username}
                      onClose={onClose}
                      userId={f.following.id}
                      onUnfollow={handleUnfollow}
                    />
                  </table>
                ))}

                <div ref={loadMoreRef} className="col-span-3 py-4 text-center">
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
