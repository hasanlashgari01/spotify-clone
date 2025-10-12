// FollowingCard.tsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  getFollowingCount,
  Followings,
  getUserFollowings,
} from '../../services/userDetailsService';

import FollowingSection from './FollowingSection';

import { XIcon } from 'lucide-react';
import { UserService } from '../../services/userDetailsService';
import { useFollow } from '../../context/UserFansContext';

interface FollowingCardProps {
  open?: boolean;
  onClose?: () => void;
  id: string | undefined;
}

// Helper to check if the current user is following the given user
// Returns true if the userId is in the followings list, false otherwise
const isUserFollowing = (userId: number, followings: Followings[]): boolean => {
  const isFollowing = followings.some((f) => f.following?.id === userId);

  return isFollowing;
};

const FollowingCard: React.FC<FollowingCardProps> = ({ open, onClose, id }) => {
  const { setCount, followings } = useFollow();
  const [ffollowings, setFFollowings] = useState<Followings[]>([]);

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
        if (!id) return;

        const [res, counter] = await Promise.all([
          getUserFollowings(String(id), p, limit),
          getFollowingCount(String(id), 'followings'),
        ]);

        setFFollowings((prev) => {
          const prevArr = prev ?? [];
          const combined = [...prevArr, ...(res?.followings ?? [])];

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
    [limit, setFFollowings, totalPages, id]
  );

  useEffect(() => {
    fetchFollowings(page);
  }, [fetchFollowings, page]);

  useEffect(() => {
    setFCount(ffollowings.length);
  }, [ffollowings.length]);

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

  // Fix: handleFollowToggle should only update the list by removing the unfollowed user,
  // since in the "Following" list, unfollowing means you are no longer following them.
  // Also, always pass currentlyFollowing as true, since you are following them.
  const handleUnfollow = useCallback(
    async (userId: number) => {
      try {
        const res = await UserService.FollowUnFollow(userId);
        if (res === 200) {
          // Remove the unfollowed user from the list

          // Update the count based on the action (unfollow)
          setCount((prev: { followings: number; followers: number }) => ({
            ...prev,
            followings: Math.max(0, (prev?.followings ?? 0) - 1),
            followers: prev?.followers ?? 0,
          }));
        }
        // If status code is not 200, don't change anything - keep the current state
      } catch (error) {
        console.error('Follow/Unfollow error:', error);
        // On error, don't change anything - keep the current state
      }
    },
    [setCount]
  );

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
            if (isControlled) onClose?.();
            else setModal(false);
          }}
        >
          <div
            className="relative flex max-h-[80vh] min-h-[80vh] w-[90%] max-w-[500px] flex-col gap-6 overflow-y-auto rounded-2xl bg-[#101721] p-6 text-white"
            onClick={(e) => e.stopPropagation()}
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
              style={{
                maxHeight: '60vh',
                overflowY: 'auto',
                paddingBottom: '60px',
              }}
            >
              {ffollowings.map((f) => (
                <table key={f.following.id} className="w-full">
                  <FollowingSection
                    avatar={f.following.avatar}
                    fullName={f.following.fullName}
                    userId={f.following.id}
                    isFollowing={isUserFollowing(f.following.id, followings)}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowingCard;
