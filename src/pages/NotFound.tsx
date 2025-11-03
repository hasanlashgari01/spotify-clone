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

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center mb-6 sm:mb-8 md:mb-10 px-4 sm:px-0">
          <Link
  to="/"
  className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#1574f5] hover:bg-[#1565c0] text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl min-w-[120px] sm:min-w-[140px] md:min-w-[160px]"
>
  <Home size={16} />
  <span>Return Home</span>
  <ArrowRight size={12} />
</Link>

<Link
  to="/search"
  className="flex items-center justify-center gap-1.5 sm:gap-2 border-2 border-gray-600 hover:border-[#1574f5] hover:text-[#1574f5] text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 min-w-[120px] sm:min-w-[140px] md:min-w-[160px]"
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
