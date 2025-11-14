import { useState } from 'react';
import PlaylistSidebar from '../sidebar/Sidebar';

const SidebarWrapper = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <div
          className="fixed top-28 -left-2 z-40 flex h-40 w-4 cursor-pointer items-center justify-center rounded-full bg-white/15 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-white/25"
          onClick={() => setOpen(true)}
        ></div>
      )}

      <div
        className={`fixed top-0 -left-20 z-50 h-screen transition-transform duration-300 ${
          open ? 'left-0' : '-translate-x-full'
        }`}
      >
        <PlaylistSidebar />
      </div>
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}
    </>
  );
};

export default SidebarWrapper;
