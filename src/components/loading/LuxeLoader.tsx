import React from 'react';

const LuxeLoader: React.FC = () => (
  <svg
    className="h-20 w-20 animate-[spin_1.8s_ease-in-out_infinite] drop-shadow-[0_0_12px_rgba(59,130,246,0.35)]"
    viewBox="0 0 80 80"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="luxBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5BA1FF" />
        <stop offset="50%" stopColor="#3C78F2" />
        <stop offset="100%" stopColor="#1E3A8A" />
      </linearGradient>
    </defs>
    <circle
      cx="40"
      cy="40"
      r="30"
      stroke="url(#luxBlue)"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
      strokeDasharray="160"
      strokeDashoffset="100"
    />
  </svg>
);

export default LuxeLoader;
