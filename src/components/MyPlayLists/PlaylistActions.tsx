import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlOptions } from 'react-icons/sl';
import { MdDelete } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';

interface PlaylistActionsProps {
  onDelete: () => void;
  ownerId: number;
}

const PlaylistActions: React.FC<PlaylistActionsProps> = ({ onDelete, ownerId }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Only show delete option if current user is the playlist owner
  const canDelete = user && Number(user.id) === ownerId;

  if (!canDelete) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-label="Open actions"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white shadow-sm ring-1 ring-white/10 backdrop-blur-sm hover:bg-black/55 sm:h-9 sm:w-9"
      >
        <SlOptions className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl bg-[#111827] shadow-lg ring-1 ring-white/10"
          >
            <button
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-300 hover:bg-white/5 hover:text-red-200"
            >
              <MdDelete className="h-4 w-4" /> حذف پلی لیست
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlaylistActions;


