import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import MusicPlayers from '../MusicPlayer/MusicPlayer';

const AppLayout = () => {
  const location = useLocation();
  const hideForAuth = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-[#0b1220]">
      {!hideForAuth && <Navbar />}
      <main className={!hideForAuth ? 'pt-2 pb-28' : ''}>
        <Outlet />
      </main>
      {!hideForAuth && (
        <div className="fixed inset-x-0 bottom-0 z-40">
          <MusicPlayers />
        </div>
      )}
    </div>
  );
};

export default AppLayout;


