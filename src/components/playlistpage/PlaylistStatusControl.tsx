import { useEffect, useState } from 'react';
import { MeResponse, getMe } from '../../services/meService';
import type { PlaylistStatus } from '../../services/playlistDetailsService';
import { LuRepeat2 } from 'react-icons/lu';

type Props = {
  value?: PlaylistStatus | null;
  canEdit?: boolean;
  ownerId?: number;
  onSelect: (next: PlaylistStatus) => Promise<void> | void;
};

const PlaylistStatusControl = ({
  value,
  canEdit,
  ownerId,
  onSelect,
}: Props) => {
  const current: PlaylistStatus = (value as PlaylistStatus) ?? 'public';
  const [pending, setPending] = useState(false);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState<boolean>(false);

  const effectiveCanEdit =
    typeof canEdit === 'boolean'
      ? canEdit
      : me && ownerId != null
        ? me.sub === ownerId
        : false;

  useEffect(() => {
    if (typeof canEdit === 'boolean') return;
    if (ownerId == null) return;
    let mounted = true;
    (async () => {
      try {
        setLoadingMe(true);
        const u = await getMe();
        if (!mounted) return;
        setMe(u);
      } catch (e) {
        console.log('Error occured : ', e);
      } finally {
        if (mounted) setLoadingMe(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [canEdit, ownerId]);

  const handleToggle = async () => {
    if (pending) return;

    const next: PlaylistStatus = current === 'public' ? 'private' : 'public';

    try {
      setPending(true);
      await onSelect(next);
    } finally {
      setPending(false);
    }
  };

  if (!effectiveCanEdit || loadingMe) {
    return (
      <span className="inline-flex items-center gap-1">
        <span className="capitalize">{current}</span>
        <span>playlist</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      className="inline-flex cursor-pointer items-center gap-1 rounded-lg p-1 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={handleToggle}
      disabled={pending}
      title={`Change to ${current === 'public' ? 'private' : 'public'}`}
    >
      <span className="text-center capitalize">{current}</span>
      <span>playlist</span>
      <LuRepeat2 size={20} className="mb-1" />
    </button>
  );
};

export default PlaylistStatusControl;
