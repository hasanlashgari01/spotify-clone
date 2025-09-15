import React, { useEffect, useState } from 'react';
import { FaPen } from 'react-icons/fa';
import Modal from '../MyPlayLists/Modal';
import EditPlaylistForm from './EditPlaylistForm';
import { Playlistinfo } from '../../services/playlistDetailsService';
import { getMe, MeResponse } from '../../services/meService';

interface Props {
  playlist: Playlistinfo;
  onUpdated?: () => void;
}

const EditPlaylistButton: React.FC<Props> = ({ playlist, onUpdated }) => {
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

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

  if (loadingMe) return null;

  if (!isOwner) return null;

  return (
    <>
      <div
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-[#0000009a] text-white md:absolute md:right-10"
        onClick={() => setOpen(true)}
        title="Edit playlist"
      >
        <FaPen />
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <EditPlaylistForm
          playlist={playlist}
          onCancel={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            if (onUpdated) onUpdated();
          }}
        />
      </Modal>
    </>
  );
};

export default EditPlaylistButton;
