import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaCrown, FaBell } from 'react-icons/fa';
import { IoMenu, IoClose } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import { useAuth } from '../hooks/useAuth';
const HomeLogo = '/home/Zavazinologo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize search value from URL when present
  useEffect(() => {
    const q = params.get('q') || '';
    setSearchValue(q);
  }, [params]);

  // Debounced navigation to search page with query
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = searchValue.trim();
      if (trimmed.length > 0) {
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [searchValue, navigate]);

  return (
    <>
      <nav className="relative flex w-full items-center justify-between bg-gray-900 px-4 py-2 ">
        {/* Left side (Mobile: Menu + Crown) */}
        <div className="flex items-center gap-3 md:hidden">
          {menuOpen ? (
            <IoClose
              className="cursor-pointer text-2xl text-white"
              onClick={() => setMenuOpen(false)}
            />
          ) : (
            <IoMenu
              className="cursor-pointer text-2xl text-white"
              onClick={() => setMenuOpen(true)}
            />
          )}
          <FaCrown className="text-lg text-yellow-500" />
        </div>

        {/* Center: Logo */}
        <div className="flex flex-1 items-center justify-center">
          <Link to={'/'}><img src={HomeLogo} alt="Logo" className="h-6 w-auto md:h-15" /></Link>
        </div>

        {/* Right side (Mobile: Bell + Profile) */}
        <div className="flex items-center gap-3 md:hidden">
          <FaBell className="h-8 w-8 cursor-pointer rounded-full bg-white p-1 text-xl text-black" />
          <div className="relative" ref={profileMenuRef}>
            <div
              className="h-8 w-8 cursor-pointer overflow-hidden rounded-full text-white"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              {isAuthenticated && user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <CgProfile size={30} />
              )}
            </div>
            {profileMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-gray-800 py-1 shadow-lg">
                {isAuthenticated ? (
                  <>
                    <div className="border-b border-gray-700 px-4 py-2 text-sm text-white">
                      {user?.fullName || user?.email}
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden w-full items-center justify-between md:flex">
          {/* Left: Logo + Menu Items */}
          <div className="flex items-center gap-6">
            <Link to={'/'}><img src={HomeLogo} alt="Logo" className="w-10" /></Link>
            <span className="cursor-pointer text-white hover:text-blue-400">
              <Link to={'profile'}>Profile</Link>
            </span>
            <span className="cursor-pointer text-white hover:text-blue-400">
              <Link to={'/podcasts'}>Podcasts</Link>
            </span>
            <span className="cursor-pointer text-white hover:text-blue-400">
              <Link to={'/genre'}>Genre</Link>
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex w-full items-center rounded-full bg-gray-800 px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500 md:w-[35%] lg:w-[35%]">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="What do you want to play?"
              className="w-full bg-transparent text-lg text-white transition-all duration-200 outline-none placeholder:text-gray-400 focus:ring-0 focus:outline-none"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
              />
            </svg>
          </div>

          {/* Right: Premium + Bell + Profile */}
          <div className="flex items-center gap-4">
            <button className="flex  items-center gap-1 h-9 w-9 justify-center cursor-pointer bg-blue-500 rounded-full text-white hover:bg-blue-600">
               <FaCrown className="text-yellow-300" />
            </button>
            <FaBell
              className="h-9 w-9 cursor-pointer rounded-full bg-white p-2 text-xl text-black"
              size={5}
            />
            <div className="relative" ref={profileMenuRef}>
              <div
                className="h-8 w-8 cursor-pointer overflow-hidden rounded-full"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                {isAuthenticated && user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <CgProfile className="text-2xl text-white" size={30} />
                )}
              </div>
              {profileMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-gray-800 py-1 shadow-lg">
                  {isAuthenticated ? (
                    <>
                      <div className="border-b border-gray-700 px-4 py-2 text-sm text-white">
                        <Link to={'/profile'}> {user?.fullName || user?.email}</Link>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="flex flex-col items-start gap-3 bg-gray-800 px-6 py-4 text-white md:hidden">
          <span className="cursor-pointer hover:text-blue-400">
            <Link to={'/profile'}>Profile</Link>
          </span>
          <span className="cursor-pointer hover:text-blue-400">
            <Link to={'/podcasts'}>Podcasts</Link>
          </span>
          <span className="cursor-pointer hover:text-blue-400">
            <Link to={'/genre'}>Genre</Link>
          </span>
        </div>
      )}
    </>
  );
};

export default Navbar;
