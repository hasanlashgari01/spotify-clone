import React, { useState } from 'react';
import { useDeletePlaylist } from '../../hooks/useDeletePlaylist';
import ConfirmDialog from './ConfirmDialog';
import { MdDelete } from 'react-icons/md';

interface DeletePlaylistButtonProps {
  playlistId: number;
  playlistTitle: string;
  onDeleted?: () => void;
}

const DeletePlaylistButton: React.FC<DeletePlaylistButtonProps> = ({
  playlistId,
  playlistTitle,
  onDeleted,
}) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeletePlaylist();

  const handleConfirm = () => {
    mutate(playlistId, {
      onSuccess: () => {
        setOpen(false);
        onDeleted?.();
      },
    });
  };

  return (
    <>
      <button
        aria-label="حذف پلی لیست"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10 hover:text-red-200"
      >
        <MdDelete className="h-4 w-4" />
        <span className="hidden sm:inline">حذف</span>
      </button>

      <ConfirmDialog
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
        isLoading={isPending}
        title="حذف این پلی لیست؟"
        description={`"${playlistTitle}" به طور کامل حذف خواهد شد.`}
        confirmText="حذف"
        cancelText="انصراف"
      />
    </>
  );
};

export default DeletePlaylistButton;


