import { useState, useEffect, useRef } from 'react';
import { IoAdd } from 'react-icons/io5';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { playlistService, Playlist } from '../../services/playlistService';
import { httpService } from '../../config/axios';
import { Link } from 'react-router-dom';
import '../../styles/glass.css';
import { MdMenuOpen } from 'react-icons/md';

const PlaylistSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const data = await playlistService.getMyPlaylists(1, 20);
      setPlaylists(data.playlists);
    } catch (err) {
      console.error('Error fetching playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      if (!sidebarRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <motion.div
        ref={sidebarRef}
        initial={false}
        animate={{ width: isExpanded ? 280 : 70 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="liquid-glass-card fixed top-0 left-0 z-50 h-screen border-r border-white/10"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 p-3">
            <AnimatePresence>
              {isExpanded && (
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-lg font-bold text-white"
                >
                  My Playlists
                </motion.h2>
              )}
            </AnimatePresence>
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 transition-all hover:bg-white/20"
            >
              <MdMenuOpen color="white" size={20} />
            </button>
          </div>

          <div className="p-2">
            <motion.button
              onClick={() => setShowCreateModal(true)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-lg bg-gradient-to-br from-[#1574f5] via-[#1574f5]/40 to-transparent p-3 transition-all ${
                !isExpanded ? 'justify-center' : ''
              }`}
            >
              <IoAdd className="text-2xl text-white" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-sm font-semibold text-white"
                  >
                    Create Playlist
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <div className="scrollbar-hide flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            ) : (
              <Reorder.Group
                axis="y"
                values={playlists}
                onReorder={setPlaylists}
                className="space-y-2"
              >
                {playlists.map((playlist) => (
                  <Reorder.Item
                    key={playlist.id}
                    value={playlist}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <Link to={`/playlists/${playlist.slug}/details`}>
                      <motion.div
                        className={`flex items-center gap-3 rounded-lg p-1 transition-all hover:bg-white/10 ${
                          !isExpanded ? 'justify-center' : ''
                        }`}
                      >
                        {playlist.cover ? (
                          <img
                            src={playlist.cover}
                            alt={playlist.title}
                            className="rounded-md"
                          />
                        ) : (
                          <img
                            src="/default.webp"
                            alt={playlist.title}
                            className="rounded-md"
                          />
                        )}

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="flex-1 overflow-hidden"
                            ></motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Link>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </div>
        </div>
      </motion.div>

      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchPlaylists();
        }}
      />
    </>
  );
};

const CreatePlaylistModal = ({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const fd = new FormData();
    fd.append('title', title);
    if (description) fd.append('description', description);
    if (cover) fd.append('cover', cover);

    try {
      setLoading(true);
      await httpService.post('/playlists', fd);
      setTitle('');
      setDescription('');
      setCover(null);
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-black p-6 shadow-2xl"
        >
          <h2 className="mb-4 text-2xl font-bold text-white">
            Create New Playlist
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Playlist"
                className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCover(e.target.files?.[0] ?? null)}
                className="w-full cursor-pointer rounded-lg bg-white/10 px-4 py-3 text-white/60"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your playlist..."
                className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg bg-white/10 px-4 py-3 text-white transition-all hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="flex-1 rounded-lg bg-[#1570ff] px-4 py-3 font-semibold text-white transition-all disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlaylistSidebar;
