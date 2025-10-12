import { useEffect, useState, useRef, useCallback } from 'react';
import {
  getFollowingCount,
  getUserFollowers,
  getUserFollowings,
} from '../../services/userDetailsService';
import { authService } from '../../services/authService';
import FollowerSection from './FollowerSection';
import { XIcon } from 'lucide-react';
import { useFollow } from '../../context/UserFansContext';
import { Followers, Followings } from '../../services/userDetailsService';
import { UserService } from '../../services/userDetailsService';
interface FollowersCardProps {
  open?: boolean;
  onClose?: () => void;
  id: string | undefined;
}

const isUserFollowing = (userId: number, followings: Followings[]): boolean => {
  return followings.some((f) => f.following?.id === userId);
};

const FollowersCard = ({ open, onClose, id }: FollowersCardProps) => {
  const { followings, setFollowings, setCount } = useFollow();
  const [ffollowers, setFFollowers] = useState<Followers[]>([]);
  const [modal, setModal] = useState<boolean | null>(null);
  const isControlled = typeof open === 'boolean';
  const isOpen = isControlled ? !!open : !!modal;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;
  const [loading, setLoading] = useState<boolean>(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchFollowers = useCallback(
    async (p: number) => {
      if (p > totalPages) return;
      setLoading(true);
      try {
        if (!id) return;
        const [res] = await Promise.all([
          getUserFollowers(String(id), p, limit),
          getFollowingCount(String(id), 'followers'),
        ]);
        
        setFFollowers((prev) => {
          const prevArr = prev ?? [];
          const combined = [...prevArr, ...(res?.followers ?? [])];
          const map = new Map<number, Followers>();
          combined.forEach((item) => {
            const key =
              item.follower?.id ?? item.followerId ?? item.follower?.id;
            if (typeof key === 'number') map.set(key, item);
          });
          return Array.from(map.values());
        });
        if (res?.pagination?.pageCount) setTotalPages(res.pagination.pageCount);
      } catch (err) {
        console.error('fetchFollowers error', err);
      } finally {
        setLoading(false);
      }
    },
    [limit, setFFollowers, totalPages, id]
  );

  useEffect(() => {
    fetchFollowers(page);
  }, [fetchFollowers, page]);

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
    const refCurrent = loadMoreRef.current;
    if (refCurrent) observer.observe(refCurrent);
    return () => {
      if (refCurrent) observer.unobserve(refCurrent);
    };
  }, [isOpen, loading, page, totalPages]);

  const handleFollowToggle = useCallback(
    async (userId: number) => {
      try {
        const isFollowing = isUserFollowing(userId, followings);
        const res = await UserService.FollowUnFollow(userId);
        if (res === 200) {
          if (isFollowing) {
            setFollowings((prev) =>
              prev.filter((f) => f.following.id !== userId)
            );
            setCount((prev: { followings: number; followers: number }) => ({
              ...prev,
              followings: Math.max(0, (prev?.followings ?? 0) - 1),
              followers: prev?.followers ?? 0,
            }));
          } else {
            // بعد از فالو، باید لیست فالوینگ را رفرش کنیم
            const me = await authService.getUser();
            if (!me?.id) return;
            const data = await getUserFollowings(`${me.id}`, 1, 1000000);
            setFollowings(data?.followings ?? []);
            setCount((prev: { followings: number; followers: number }) => ({
              ...prev,
              followings: (prev?.followings ?? 0) + 1,
              followers: prev?.followers ?? 0,
            }));
          }
        }
      } catch (error) {
        console.error('Follow/Unfollow error:', error);
      }
    },
    [followings, setFollowings, setCount]
  );

  if (isControlled && !isOpen) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-20 bg-transparent p-10">
      {isOpen && (
        <div
          className="fixed inset-0 z-10000 flex items-center justify-center bg-black/50"
          onClick={() => {
            if (isControlled) {
              onClose?.();
            } else {
              setModal(false);
            }
          }}
        >
          <div
            className="thin-scrollbar relative flex max-h-[80vh] min-h-[70vh] w-[90%] max-w-[600px] flex-col gap-6 overflow-y-auto rounded-2xl bg-[#101721] p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row items-center justify-start">
              <h2 className="text-center text-2xl font-bold">Followers</h2>
              <div
                onClick={() => {
                  if (isControlled) {
                    onClose?.();
                  } else {
                    setModal(false);
                  }
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
              {ffollowers.length > 0 ? (
                ffollowers.map((f, i) => (
                  <table key={i} className="w-full">
                    <FollowerSection
                      avatar={f.follower.avatar}
                      fullName={f.follower.fullName}
                      userId={f.follower.id}
                      isFollowing={isUserFollowing(f.follower.id, followings)}
                      onFollow={handleFollowToggle}
                      onUnfollow={handleFollowToggle}
                    />
                  </table>
                ))
              ) : (
                <div className="py-6 text-center text-gray-400">
                  No followers yet
                </div>
              )}
              <div ref={loadMoreRef} className="col-span-3 py-4 text-center">
                {loading && <p>Loading more...</p>}
                {!loading && page >= totalPages && (
                  <p className="text-gray-400">No more followers</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowersCard;
