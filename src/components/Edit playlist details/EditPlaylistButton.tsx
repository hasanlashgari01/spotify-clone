import React, { useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Modal from '../MyPlayLists/Modal';
import EditPlaylistForm from './EditPlaylistForm';
import ConfirmDialog from '../MyPlayLists/ConfirmDialog';
import { Playlistinfo } from '../../services/playlistDetailsService';
import { getMe, MeResponse } from '../../services/meService';
import { useDeletePlaylist } from '../../hooks/useDeletePlaylist';

interface Props {
  playlist: Playlistinfo;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

const EditPlaylistButton: React.FC<Props> = ({ playlist, onUpdated, onDeleted }) => {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const { mutate: deletePlaylist, isPending: isDeleting } = useDeletePlaylist();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingMe(true);
        const u = await getMe();
        if (!mounted) return;
        setMe(u);
        setIsOwner(u.sub === playlist.owner.id);
      } catch (err) {
        console.error('getMe error', err);
      } finally {
        if (mounted) setLoadingMe(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [playlist.owner.id]);

  const handleDelete = () => {
    deletePlaylist(playlist.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        if (onDeleted) onDeleted();
      },
    });
  };

  if (loadingMe) return null;

  if (!isOwner) return null;

  return (
    <>
      <div className="flex gap-2 md:absolute md:right-10">
        <div
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-[#0000009a] text-white"
          onClick={() => setOpen(true)}
          title="Edit playlist"
        >
          <FaPen />
        </div>
        
        <div
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-[#0000009a] text-red-400 hover:text-red-300"
          onClick={() => setDeleteOpen(true)}
          title="Delete playlist"
        >
          <MdDelete />
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <EditPlaylistForm
          playlist={playlist}
          onCancel={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            if (onUpdated) onUpdated();
          }}
          onDeleted={() => {
            setOpen(false);
            if (onDeleted) onDeleted();
          }}
        />
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="از حذف این پلی لیست مطمین هستید؟"
        description={`"${playlist.title}" به طور کامل حذف خواهد شد.`}
        confirmText="حذف"
        cancelText="انصراف"
      />
    </>
  );
};

export default EditPlaylistButton;
