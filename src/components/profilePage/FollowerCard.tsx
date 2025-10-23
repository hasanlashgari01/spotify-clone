import  { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  getFollowingCount,
  getUserFollowers,
} from '../../services/userDetailsService';

import FollowerSection from './FollowerSection';
import { XIcon } from 'lucide-react';
import { useFollow } from '../../context/UserFansContext';

interface FollowersCardProps {
  open?: boolean;
  onClose?: () => void;
  profileUserId: string ; // <-- new prop to specify whose followers to load
}

const FollowersCard = ({ open, onClose, profileUserId }: FollowersCardProps) => {
  const { followers, setFollowers } = useFollow();
  const [, setFCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [modal, setModal] = useState<boolean>(false);

  const isControlled = typeof open === 'boolean';
  const isOpen = isControlled ? !!open : modal;

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Reset followers and pagination on profileUserId or modal open/close
  useEffect(() => {
    if (!isOpen) return;

    setFollowers([]);    // clear old followers when user changes
    setPage(1);
    setTotalPages(1);
  }, [profileUserId, isOpen, setFollowers]);

  // Fetch followers when page changes or profileUserId changes
  useEffect(() => {
    if (!isOpen) return;
    if (page > totalPages) return;

    const fetchFollowers = async () => {
      setLoading(true);

      try {
        const [res, counter] = await Promise.all([
          getUserFollowers(profileUserId, page, limit),  // fetch followers of the current profile user
          getFollowingCount(profileUserId, 'followers'),
        ]);

        setFollowers((prev) => {
          const combined = [...prev, ...(res?.followers ?? [])];
          // Filter duplicates by follower id
          const unique = combined.filter(
            (f, index, self) =>
              index === self.findIndex((x) => x.follower.id === f.follower.id)
          );
          return unique;
        });

        setFCount(counter ?? 0);
        if (res?.pagination.pageCount) setTotalPages(res.pagination.pageCount);
      } catch (error) {
        console.error('Fetch followers error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [page, isOpen, profileUserId, setFollowers, totalPages]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Infinite scroll intersection observer
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

  // Lock scroll when modal open
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

  if (isControlled && !isOpen) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-20 bg-transparent p-10">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="followers-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={() => {
              if (isControlled) onClose?.();
              else setModal(false);
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
                <h2 className="text-center text-2xl font-bold">Followers</h2>
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
                {followers.length > 0 ? (
                  followers.map((f, i) => (
                    <table key={i} className="w-full">
                      <FollowerSection
                        avatar={f.follower.avatar}
                        fullName={f.follower.fullName}
                        username={f.follower.username}
                        role={f.follower.role}
                        createdAt={f.createdAt}
                        userId={f.follower.id}
                        onClose={onClose}
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
              {/* asdasdadasdas */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FollowersCard;
