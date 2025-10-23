import './styles/App.css';
import GenreItems from './pages/Genres/GenreItems';
import Genres from './pages/Genres/Genres';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import MusicPlayers from './components/MusicPlayer/MusicPlayer';
import { ProtectedRoute } from './components/Protect Route/ProtectedRoute';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PlaylistPage from './pages/PlaylistPage';
import Profile from './pages/Profile';
import ReactQueryProvider from './providers/react-query-provider';
import RegisterPage from './pages/RegisterPage';
import { Toaster } from 'react-hot-toast';
import UsersProfile from './pages/UsersProfile';
import SearchPage from './pages/SearchPage';
import { MusicSB } from './components/music-sidebar/MusicSb.tsx';
const ConditionalMusicPlayer = () => {
  const location = useLocation();
  const shouldHidePlayer =
    location.pathname === '/login' || location.pathname === '/register';

  return !shouldHidePlayer ? <MusicPlayers /> : null;
};





  function App() {


    return (
      <ReactQueryProvider>+
        <BrowserRouter>
          <MusicPlayerProvider>
            <div className="flex h-[100vh] w-[100vw] flex-row overflow-hidden">
              <MusicSB />

              <div className="flex-1 overflow-auto bg-[#0c1218] text-white">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/playlist/:slug" element={<PlaylistPage />} />
                  <Route
                    path="/profile/:username"
                    element={<UsersProfile />}
                  ></Route>
                  <Route path="/search" element={<SearchPage />}></Route>
                  <Route path="/genre" element={<Genres />} />
                  <Route path="/genre/:title" element={<GenreItems />} />
                  <Route
                    path="/profile/:username"
                    element={<UsersProfile />}
                  ></Route>
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </div>

            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#101720',
                  color: '#fff',
                  borderRadius: '20px',
                  padding: '10px',
                },
              }}
            />

            <MusicPlayers />

            <ConditionalMusicPlayer />
          </MusicPlayerProvider>
        </BrowserRouter>
      </ReactQueryProvider>
    );
}

export default App;
