import { useState, useEffect, useRef } from 'react';
import { FaCrown, FaBell } from 'react-icons/fa';
import { IoMenu, IoClose } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import { useAuth } from '../hooks/useAuth';
import HomeLogo from '../../public/home/home-logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event:MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="relative flex w-full items-center justify-between bg-gray-900 px-4 py-3">
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
          <img src={HomeLogo} alt="Logo" className="h-6 w-auto md:h-8" />
        </div>

        {/* Right side (Mobile: Bell + Profile) */}
        <div className="flex items-center gap-3 md:hidden">
          <FaBell className="h-8 w-8 bg-white text-black p-1 rounded-full cursor-pointer text-xl" />
          <div className="relative" ref={profileMenuRef}>
            <div 
              className="h-8 w-8 text-white overflow-hidden rounded-full cursor-pointer" 
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              {isAuthenticated && user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <CgProfile size={30}/>
              )}
            </div>
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm text-white border-b border-gray-700">
                      {user?.name || user?.email}
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
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
            <img src={HomeLogo} alt="Logo" className="h-8 w-auto" />
            <span className="cursor-pointer text-white hover:text-blue-400">
              Music
            </span>
            <span className="cursor-pointer text-white hover:text-blue-400">
              Podcasts
            </span>
            <span className="cursor-pointer text-white hover:text-blue-400">
              Live
            </span>
          </div>

          {/* Search Bar */}
          <div className="flex items-center rounded-full bg-gray-800 px-3 py-1">
            <input
              type="text"
              placeholder="Search for artists, songs, or podcasts..."
              className="bg-transparent text-sm text-white outline-none"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
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
            <button className="flex items-center gap-1 rounded-full bg-blue-500 px-4 py-1 text-white hover:bg-blue-600">
              Go to Premium <FaCrown className="text-yellow-300" />
            </button>
            <FaBell
              className="h-9 w-9 cursor-pointer rounded-full bg-white p-2 text-xl text-black"
              size={5}
            />
            <div className="relative" ref={profileMenuRef}>
              <div 
                className="h-8 w-8 overflow-hidden rounded-full cursor-pointer"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                {isAuthenticated && user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <CgProfile className="text-2xl text-white" size={30}/>
                )}
              </div>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-sm text-white border-b border-gray-700">
                        {user?.name || user?.email}
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
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
          <span className="cursor-pointer hover:text-blue-400">Music</span>
          <span className="cursor-pointer hover:text-blue-400">Podcasts</span>
          <span className="cursor-pointer hover:text-blue-400">Live</span>
        </div>
      )}
    </>
  );
};

export default Navbar;
