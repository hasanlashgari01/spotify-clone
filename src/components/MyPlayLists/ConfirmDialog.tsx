import React from 'react';
import Modal from './Modal';
import { MdWarning, MdDelete } from 'react-icons/md';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'آیا مطمئن هستید؟',
  description = 'این عمل قابل بازگشت نیست.',
  confirmText = 'حذف',
  cancelText = 'انصراف',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="text-right animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex flex-col gap-6 p-6 w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto bg-[#0b1017] rounded-2xl shadow-xl">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="flex-1 text-center sm:text-right">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{title}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
            </div>
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-red-500/20 text-red-400 animate-pulse">
              <MdWarning className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full sm:flex-1 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm sm:text-base font-medium text-white transition-all duration-200 hover:bg-white/10 hover:border-white/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="group relative w-full sm:flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 text-sm sm:text-base font-medium text-white transition-all duration-200 hover:from-red-500 hover:to-red-600 hover:shadow-lg hover:shadow-red-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  <span>در حال حذف...</span>
                </div>
              ) : (
                <>
                  <MdDelete className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:scale-110" />
                  <span>{confirmText}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
