import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlOptions } from "react-icons/sl";
import { MdDelete } from "react-icons/md";
import { useAuth } from "../../hooks/useAuth";

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
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const canDelete = user && Number(user.id) === ownerId;
  if (!canDelete) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        aria-label="Open actions"
        onClick={() => setOpen((v) => !v)}
        className={`
          group flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full 
          bg-gradient-to-br from-gray-800/60 to-gray-900/80 
          text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md
          transition-all duration-300 ease-out relative right-7
          hover:from-gray-700/70 hover:to-gray-800/90 
          hover:ring-white/20 hover:shadow-xl hover:scale-105
          active:scale-95 active:from-gray-600/80 active:to-gray-700/90
          ${open ? "ring-white/30 shadow-xl scale-105" : ""}
        `}
      >
        <SlOptions
          className={`h-5 w-5 transition-transform duration-200 
          ${open ? "rotate-180" : "group-hover:rotate-90"}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="
            absolute top-full right-0 z-30 mt-2 w-48 sm:w-56 
            rounded-2xl border border-white/10 shadow-2xl 
            bg-gradient-to-br from-gray-950/95 to-gray-800/90 
            backdrop-blur-xl ring-1 ring-white/10 
          "
        >
        
            <div className="p-1">
              <button
                onClick={() => {
                  setOpen(false);
                  onDelete();
                }}
                className="
                  group flex w-full items-center gap-3 px-4 py-3 
                  text-left text-sm sm:text-base font-medium text-red-300
                  rounded-xl transition-all duration-200 ease-out
                  hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-600/10 
                  hover:text-red-200 hover:shadow-lg hover:scale-[1.02]
                  active:scale-[0.98] active:bg-red-500/20
                "
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg 
                  bg-red-500/20 group-hover:bg-red-500/30 transition-colors duration-200"
                >
                  <MdDelete className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-medium">
                    حذف پلی‌لیست
                  </span>
                  <span className="text-xs text-red-400/70 group-hover:text-red-300/80">
                    این عمل قابل بازگشت نیست
                  </span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlaylistActions;
