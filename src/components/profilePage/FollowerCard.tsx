import { useEffect, useState, useRef } from 'react';
import {
  getFollowingCount,
  Followers,
  getUserFollowers,
} from '../../services/userDetailsService';
import { authService } from '../../services/authService';
import defAvatar from '../../../public/default-avatar.webp';
import FollowerSection from './FollowerSection';
import { useMediaQuery } from 'react-responsive';

const FollowersCard = () => {
  const isMobile = useMediaQuery({ maxWidth: 779 });
  const isTablet = useMediaQuery({ minWidth: 780, maxWidth: 1194 });
  const isDesktop = useMediaQuery({ minWidth: 1195 });

  const [followers, setFollowers] = useState<Followers[]>([]);
  const [fCount, setFCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [modal, setModal] = useState<boolean | null>(null);

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
  }, [page]);

  useEffect(() => {
    if (!modal) return;

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
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [modal, loading, page, totalPages]);

  return (
    <div className="flex flex-col items-center justify-center gap-20 bg-transparent p-10">
      {modal && followers.length > 0 && (
        <div
          className="fixed inset-0 z-10000 flex items-center justify-center bg-black/50"
          onClick={() => setModal(false)}
        >
          <div
            className="relative flex max-h-[80vh] min-h-[70vh] w-[90%] max-w-[600px] flex-col gap-6 overflow-y-auto rounded-2xl bg-gray-800 p-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-center text-2xl font-bold">Followers</h2>

            <div className="flex flex-col" style={{ maxHeight: '60vh', overflowY: 'auto', paddingBottom: '60px' }}>
              {followers.map((f, i) => (
                <table key={i} className="w-full">
                  <FollowerSection avatar={f.follower.avatar} fullName={f.follower.fullName} />
                </table>
              ))}

              <div ref={loadMoreRef} className="col-span-3 text-center py-4">
                {loading && <p>Loading more...</p>}
                {!loading && page >= totalPages && <p className="text-gray-400">No more followers</p>}
              </div>
            </div>

            <button
              onClick={() => setModal(false)}
              className="fixed bottom-[10%] left-1/2 -translate-x-1/2 rounded-xl bg-red-600 px-6 py-2 font-bold hover:bg-red-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isDesktop && (
        <div className="flex h-60 w-350 flex-row items-center justify-start rounded-3xl border-4 border-blue-900 text-center">
          <div className="flex w-[30%] flex-col gap-5">
            <h2 className="text-5xl text-white">Followers</h2>
            <h2 className="text-5xl font-bold text-blue-600">{fCount}+</h2>
          </div>

          {followers.length > 0 && (
            <>
              <div className="flex w-[50%] flex-row">
                {followers.slice(0, 5).map((f, i) => (
                  <img
                    key={i}
                    src={f.follower.avatar ?? defAvatar}
                    alt="maybe"
                    className={`-ml-5 h-35 w-35 rounded-[25px] border-3 border-blue-900 first:ml-0`}
                    style={{ zIndex: followers.length + i }}
                  />
                ))}
              </div>

              <div className="flex w-[20%] justify-end">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="h-10 w-20 cursor-pointer text-white"
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

      {(isMobile || isTablet) && (
        <div className="w-content flex flex-col items-center gap-5">
          <div className="w-content flex flex-row items-start justify-start gap-6">
            <h2 className="text-3xl text-white">Followers</h2>
            <h2 className="text-3xl font-bold text-blue-600">{fCount}</h2>
          </div>

          {followers.length > 0 && (
            <>
              <div className="flex flex-row">
                {followers.slice(0, 5).map((f, i) => (
                  <img
                    key={i}
                    src={f.follower.avatar ?? defAvatar}
                    alt="maybe"
                    className={`-ml-3 rounded-full border-3 border-blue-900 first:ml-0 ${
                      isMobile ? 'h-12 w-12' : 'h-16 w-16'
                    }`}
                    style={{ zIndex: followers.length + i }}
                  />
                ))}
              </div>

              <div className="flex w-[20%] justify-end">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="h-7 w-10 rotate-90 transform cursor-pointer text-white"
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

export default FollowersCard;
