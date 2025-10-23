import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdTrash, IoMdClose } from 'react-icons/io';
import { playlistService } from '../../services/playlistService';

interface Props {
  open: boolean;
  onClose: () => void;
  playlist: {
    id: number;
    title: string;
    cover?: string;
  };
  onSuccess: () => void;
}

const DeleteConfirmationModal: React.FC<Props> = ({
  open,
  onClose,
  playlist,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await playlistService.deletePlaylist(String(playlist.id));

      if (result?.stat === 'success') {
        onSuccess();
        onClose();
      } else {
        console.error('Failed to delete playlist:', result?.message);
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 mx-4 w-full max-w-md rounded-2xl p-6 shadow-2xl"
            style={{
              background:
                'linear-gradient(180deg, #101721 0%, rgba(16,23,33,0.95) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                  <IoMdTrash className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Delete Playlist
                  </h3>
                  <p className="text-sm text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <IoMdClose size={20} />
              </button>
            </div>

            {/* Playlist Info */}
            <div className="mb-6 flex items-center gap-4 rounded-xl bg-white/5 p-4">
              <img
                src={playlist.cover || '/default.webp'}
                alt={playlist.title}
                className="h-16 w-16 rounded-lg object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/default.webp';
                }}
              />
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-semibold text-white">
                  {playlist.title}
                </h4>
                <p className="text-sm text-gray-400">
                  Are you sure you want to delete this playlist?
                </p>
              </div>
            </div>

            {/* Warning */}
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
              <p className="text-sm text-red-300">
                <strong>Warning:</strong> This will permanently delete the
                playlist and all its songs. This action cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-white/10 px-4 py-3 font-medium text-white transition-colors hover:bg-white/20 disabled:opacity-50"
              >
                Cancel
              </button>
              <motion.button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                whileHover={{ scale: isDeleting ? 1 : 1.02 }}
                whileTap={{ scale: isDeleting ? 1 : 0.98 }}
              >
                {isDeleting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <IoMdTrash size={16} />
                    Delete
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
