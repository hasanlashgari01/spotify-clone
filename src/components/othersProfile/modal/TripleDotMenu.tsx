import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  username?: string | undefined;
}

const TripleDotMenu: React.FC<Props> = ({ isOpen, onClose, userId, username }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-20 z-50 w-56 rounded bg-white/5 p-4 shadow-lg text-white">
      <div className="mb-2 text-sm text-gray-300">User: <span className="font-medium text-white">{username ?? `#${userId}`}</span></div>
      <div className="flex flex-col gap-2">
        <button onClick={() => {}} className="text-left">View Profile</button>
        <button onClick={() => {}} className="text-left">Report</button>
        <button onClick={onClose} className="text-left text-red-400">Close</button>
      </div>
    </div>
  );
};

export default TripleDotMenu;
