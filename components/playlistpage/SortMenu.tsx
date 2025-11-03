import React, { useEffect, useRef, useState } from "react";

import type {
  SongSortBy,
  SortOrder,
} from '../../services/playlistDetailsService';

type Props = {
  sortBy: SongSortBy;
  order: SortOrder;
  onChange: (sortBy: SongSortBy, order: SortOrder) => void;
};

const OPTIONS: { key: SongSortBy; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'artist', label: 'Artist' },
  { key: 'duration', label: 'Duration' },
  { key: 'createdAt', label: 'Created at' },
];

const SortMenu: React.FC<Props> = ({ sortBy, order, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleSelect = (key: SongSortBy) => {
    if (key === sortBy) {
      const nextOrder: SortOrder = order === 'ASC' ? 'DESC' : 'ASC';
      onChange(sortBy, nextOrder);
    } else {
      onChange(key, 'ASC');
    }
    setOpen(false);
  };
  //شسیشسیشسیشسی

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        className="inline-flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-white hover:bg-[#101721]"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        title="Sort"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M2 12.5a.5.5 0 0 1 .5-.5H10a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5H8a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5m0-3a.5.5 0 0 1 .5-.5H6a.5.5 0 0 1 0 1H2.5a.5.5 0 0 1-.5-.5" />
          <path d="M12.354 14.354a.5.5 0 0 1-.708 0L9.5 12.207l.708-.708L11.5 12.79V2.5a.5.5 0 0 1 1 0v10.29l1.293-1.291.707.708z" />
        </svg>
        <span className="text-sm text-nowrap max-sm:hidden">
          {OPTIONS.find((o) => o.key === sortBy)?.label} · {order.toUpperCase()}
        </span>
      </button>

      {open && (
        <div className="ring-opacity-5 absolute right-0 z-20 mt-2 w-40 origin-top-right rounded-md bg-[#101721] py-1 shadow-lg ring-1 ring-black focus:outline-none">
          {OPTIONS.map((opt) => {
            const active = opt.key === sortBy;
            return (
              <button
                key={opt.key}
                className={`flex w-full cursor-pointer items-center justify-between px-3 py-2 text-sm rounded-sm ${active ? 'bg-[#00c754] text-white' : 'text-zinc-200 hover:bg-[#00c75373] hover:text-white'}`}
                onClick={() => handleSelect(opt.key)}
              >
                <span>{opt.label}</span>
                {active && (
                  <span className="text-xs">
                    {order === 'ASC' ? 'ASC' : 'DESC'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SortMenu;
