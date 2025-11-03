import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowRight } from 'lucide-react';
import '../styles/NotFound.css';
import FloatingMusicIcons from '../components/playlistpage/FloatingMusicIcons';

const NotFound = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="h-screen bg-[#101720] relative overflow-hidden">
      <FloatingMusicIcons />

      <div className="error-graphic">
        <div className="error-row">
          <div className="notfound-4">4</div>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <img src="/headphone.png" alt="Headphones" className="headphone" />
          </div>
          <div className="notfound-4">4</div>
        </div>
      </div>

      <div className="page-content">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          Oops! <span className="text-[#1574f5]">Page Not Found</span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center mb-6 sm:mb-8 md:mb-10">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 sm:gap-3 bg-[#1574f5] hover:bg-[#1565c0] text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl min-w-[140px] sm:min-w-[160px] md:min-w-[200px]"
          >
            <Home size={18} />
            <span>Return Home</span>
            <ArrowRight size={14} />
          </Link>

          <Link
            to="/search"
            className="flex items-center justify-center gap-2 sm:gap-3 border-2 border-gray-600 hover:border-[#1574f5] hover:text-[#1574f5] text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 hover:scale-105 min-w-[140px] sm:min-w-[160px] md:min-w-[200px]"
          >
            <Search size={18} />
            <span>Browse Music</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
