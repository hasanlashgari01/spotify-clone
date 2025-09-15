import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<Props> = ({ open, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
          <motion.div
            className="relative z-10 w-full max-w-lg rounded-2xl p-6 shadow-xl"
            style={{
              background:
                'linear-gradient(180deg, #101721 0%, rgba(16,23,33,0.95) 100%)',
              border: '1px solid rgba(21,116,245,0.15)',
            }}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.8 }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
