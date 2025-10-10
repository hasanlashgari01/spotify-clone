import { useEffect, useState, useRef } from 'react';
import {
  getFollowingCount,
 
  getUserFollowers,
} from '../../services/userDetailsService';
import { authService } from '../../services/authService';

import FollowerSection from './FollowerSection';

import { XIcon } from 'lucide-react';
import { useFollow } from '../../context/UserFansContext';
interface FollowersCardProps {
  open?: boolean;
  onClose?: () => void;
}

const FollowersCard = ({ open, onClose }: FollowersCardProps) => {


  const {followers , setFollowers} = useFollow()
  const [, setFCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [modal, setModal] = useState<boolean | null>(null);
  const isControlled = typeof open === 'boolean';
  const isOpen = isControlled ? !!open : !!modal;

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (page > totalPages) return;
      setLoading(true);

      try {
        const data = await authService.getUser();
        if (!data?.id) return;

        const [res, counter] = await Promise.all([
          getUserFollowers(String(data.id), page, limit),
          getFollowingCount(String(data.id), 'followers'),
        ]);

        setFollowers((prev) => {
          const combined = [...prev, ...(res?.followers ?? [])];
          const unique = combined.filter(
            (f, index, self) =>
              index === self.findIndex((x) => x.follower.id === f.follower.id)
          );
          return unique;
        });

        setFCount(counter ?? 0);
        if (res?.pagination.pageCount) setTotalPages(res.pagination.pageCount);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchFollowers();
  }, [page, setFollowers, totalPages]);

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

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [isOpen, loading, page, totalPages]);

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
            if (isControlled) {
              onClose?.();
            } else {
              setModal(false);
            }
          }}
        >
<div
  className="relative flex max-h-[80vh] min-h-[70vh] w-[90%] max-w-[600px] flex-col gap-6 overflow-y-auto rounded-2xl bg-[#101721] p-6 text-white thin-scrollbar"
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
              {followers.length > 0 ? (
                followers.map((f, i) => (
                  <table key={i} className="w-full">
                    <FollowerSection
                      avatar={f.follower.avatar}
                      fullName={f.follower.fullName}
                      userId={f.follower.id}
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
          </div>
        </div>
      )}

      

      
    </div>
  );
};

export default FollowersCard;
