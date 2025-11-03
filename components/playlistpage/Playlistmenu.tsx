import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiEdit } from 'react-icons/fi';
import { IoMdCopy, IoMdShare, IoMdTrash } from 'react-icons/io';
import { PiMusicNotesPlusFill } from 'react-icons/pi';
import { TbMusicHeart } from 'react-icons/tb';
import EditPlaylistForm from '../Edit playlist details/EditPlaylistForm';
import Modal from '../layout/modal';
import SearchModal from './SearchModal';
import DeleteConfirmationModal from '../MyPlayLists/DeleteConfirmationModal';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  isOwner?: boolean;
  isPublic?: boolean;
  playlist?: any;
  onPlaylistUpdated?: () => void;
}
//شیشسیشسی
const PlaylistMenu = ({
  isOpen,
  onClose,
  isOwner = false,
  playlist,
  onPlaylistUpdated,
}: Props) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteSuccess = () => {
    setDeleteModalOpen(false);
    if (onPlaylistUpdated) {
      onPlaylistUpdated();
    }
    // Redirect to profile page after successful deletion
    navigate('/profile');
  };
  const menuItems = [
    {
      icon: IoMdShare,
      label: 'Share Playlist',
      action: () => toast.error("Sorry Backend is Dead"),
      color: 'text-white hover:text-[#00c754]',
    },
    {
      icon: IoMdCopy,
      label: 'Copy Link',
      action: () => toast.success(`Copied successfully ( Example )`),
      color: 'text-white hover:text-[#00c754]',
    },
    {
      icon: TbMusicHeart,
      label: 'Add to Favorites',
      action: () => {
        toast.loading("Adding please wait")
        
      },
      color: 'text-white hover:text-red-400',
    },
    ...(isOwner
      ? [
          {
            icon: PiMusicNotesPlusFill,
            label: 'Add music',
            action: () => {
              (setSearchModalOpen(true), onClose());
            },
            color: 'text-white hover:text-blue-400',
          },
          {
            icon: FiEdit,
            label: 'Edit Details',
            action: () => {
              (setEditModalOpen(true), onClose());
            },
            color: 'text-white hover:text-blue-400',
          },
          {
            icon: IoMdTrash,
            label: 'Delete Playlist',
            action: () => {
              setDeleteModalOpen(true);
              onClose();
            },
            color: 'text-white hover:text-red-500',
            danger: true,
          },
        ]
      : []),
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />

            <motion.div
              ref={menuRef}
              className="fixed inset-x-0 bottom-20 z-70 mx-2 mb-2 sm:mx-4 sm:mb-4 md:left-4 md:bottom-4 md:right-auto md:mx-0 md:w-80"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 0.8,
              }}
            >
              <div
                className="rounded-2xl shadow-2xl ring-1 ring-white/10"
                style={{ backgroundColor: '#101720' }}
              >
                <div className="border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Playlist Options
                    </h3>
                    <button
                      onClick={onClose}
                      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
                    >
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-2">
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        item.action();
                        if (item.label !== 'Edit Details') {
                          onClose();
                        }
                      }}
                      className={`group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                        item.danger
                          ? 'hover:bg-red-500/10'
                          : 'hover:bg-[#00c754]/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                          item.danger
                            ? 'bg-red-500/20 group-hover:bg-red-500/30'
                            : 'bg-white/10 group-hover:bg-[#00c754]/20'
                        }`}
                      >
                        <item.icon
                          className={`text-xl transition-colors ${
                            item.danger
                              ? 'text-red-400 group-hover:text-red-300'
                              : item.color
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium transition-colors ${
                            item.danger
                              ? 'text-red-400 group-hover:text-red-300'
                              : 'text-white group-hover:text-[#00c754]'
                          }`}
                        >
                          {item.label}
                        </p>
                      </div>
                      <svg
                        className={`h-5 w-5 transition-colors ${
                          item.danger
                            ? 'text-red-400/60 group-hover:text-red-300'
                            : 'text-white/60 group-hover:text-[#00c754]'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <EditPlaylistForm
          playlist={playlist}
          onCancel={() => setEditModalOpen(false)}
          onSuccess={() => {
            setEditModalOpen(false);
            onClose();
            if (onPlaylistUpdated) onPlaylistUpdated();
          }}
        />
      </Modal>
   <SearchModal
  open={searchModalOpen}
  onClose={() => setSearchModalOpen(false)}
/>
      
      {/* Delete Confirmation Modal */}
      {playlist && (
        <DeleteConfirmationModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          playlist={{
            id: playlist.id,
            title: playlist.title,
            cover: playlist.cover
          }}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
};

export default PlaylistMenu;
