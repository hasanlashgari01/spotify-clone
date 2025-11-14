import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowRight } from 'lucide-react';
import '../styles/NotFound.css';
import FloatingMusicIcons from '../components/playlistpage/FloatingMusicIcons';
import SidebarWrapper from '../components/sidebar/SidebarWrapper';

const NotFound = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-[#101720]">
      <SidebarWrapper />
      <FloatingMusicIcons />

      <div className="error-graphic">
        <div className="error-row">
          <div className="notfound-4">4</div>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <img src="/headphone.webp" alt="Headphones" className="headphone" />
          </div>
          <div className="notfound-4">4</div>
        </div>
      </div>

      <div className="page-content">
        <h1 className="mb-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
          Oops! <span className="text-[#1574f5]">Page Not Found</span>
        </h1>

        <div className="mb-6 flex flex-col justify-center gap-3 px-4 sm:mb-8 sm:flex-row sm:gap-4 sm:px-0 md:mb-10 md:gap-5">
          <Link
            to="/"
            className="flex min-w-[120px] items-center justify-center gap-1.5 rounded-xl bg-[#1574f5] px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#1565c0] hover:shadow-xl sm:min-w-[140px] sm:gap-2 sm:rounded-2xl sm:px-6 sm:py-3 sm:text-base md:min-w-[160px] md:px-8 md:py-4"
          >
            <Home size={16} />
            <span>Return Home</span>
            <ArrowRight size={12} />
          </Link>

          <Link
            to="/search"
            className="flex min-w-[120px] items-center justify-center gap-1.5 rounded-xl border-2 border-gray-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:border-[#1574f5] hover:text-[#1574f5] sm:min-w-[140px] sm:gap-2 sm:rounded-2xl sm:px-6 sm:py-3 sm:text-base md:min-w-[160px] md:px-8 md:py-4"
          >
            <Search size={16} />
            <span>Browse Music</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
