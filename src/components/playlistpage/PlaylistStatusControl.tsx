import { useEffect, useRef, useState } from "react";
import { MeResponse, getMe } from "../../services/meService";
import type { PlaylistStatus } from "../../services/playlistDetailsService";

type Props = {
  value?: PlaylistStatus | null;
  canEdit?: boolean;
  ownerId?: number;
  onSelect: (next: PlaylistStatus) => Promise<void> | void;
};

const OPTIONS: PlaylistStatus[] = ['public', 'private'];

const PlaylistStatusControl = ({
  value,
  canEdit,
  ownerId,
  onSelect,
}: Props) => {
  const current: PlaylistStatus = (value as PlaylistStatus) ?? 'public';
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

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
        console.log("Error occured : " , e)
      } finally {
        if (mounted) setLoadingMe(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [canEdit, ownerId]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleSelect = async (next: PlaylistStatus) => {
    if (next === current) {
      setOpen(false);
      return;
    }
    try {
      setPending(true);
      await onSelect(next);
    } finally {
      setPending(false);
      setOpen(false);
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
    <div className="relative inline-flex items-center" ref={ref}>
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-1 rounded-lg p-1 transition hover:bg-white/15"
        onClick={() => !pending && setOpen((v) => !v)}
        disabled={pending}
        title="Change status"
      >
        <span className="capitalize">{current}</span>
        <span>playlist</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          className={`ml-1 text-white/80 transition ${open ? 'rotate-180' : ''}`}
          fill="currentColor"
        >
          <path d="M3.204 5.5a1 1 0 0 1 1.414 0L8 8.879l3.382-3.38a1 1 0 0 1 1.415 1.413L8.707 10.999a1 1 0 0 1-1.414 0L3.204 6.914a1 1 0 0 1 0-1.414z" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-[120%] left-0 z-20 w-36 rounded-md border border-white/10 bg-[#101721] p-1 shadow-xl">
          {OPTIONS.map((opt) => (
            <button
              key={opt}
              className={`mt-1 flex w-full cursor-pointer items-center justify-between rounded-sm px-3 py-2 text-sm font-bold capitalize ${
                opt === current
                  ? 'bg-[#00c754] text-white'
                  : 'text-white/80 hover:bg-[#00c75373] hover:text-white'
              }`}
              onClick={() => handleSelect(opt)}
              disabled={pending}
            >
              <span>{opt}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistStatusControl;
