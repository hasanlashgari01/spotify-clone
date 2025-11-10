import './styles/App.css';
import GenreItems from './components/Genres/GenreItems.tsx';
import Genres from './components/Genres/Genres.tsx';
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
import { ArtistProtector } from './components/Protect Route/ArtistProtector.tsx';
import ArtistPanel from './pages/Artist-panel.tsx';
import UsersProfile from './pages/UsersProfile';
import SearchPage from './pages/SearchPage';
import NotFound from './pages/NotFound';

import ArtistsProfile from './pages/ArtistsProfile.tsx';
import { ScrollToTop } from './components/scrolltoTop.tsx';
import AdminLayout from './pages/admin/AdminLayout.tsx';
import Dashboard from './pages/admin/Dashboard.tsx';
import Analytics from './pages/admin/Analytics.tsx';
import Playlists from './pages/admin/Playlists.tsx';
import { Settings, Users } from 'lucide-react';

const ConditionalMusicPlayer = () => {
  const location = useLocation();
  const shouldHidePlayer =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/panel';

  return !shouldHidePlayer ? <MusicPlayers /> : null;
};

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <ScrollToTop />
        <MusicPlayerProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/playlists/:slug/details" element={<PlaylistPage />} />
            <Route path="/profile/:username" element={<UsersProfile />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/genre" element={<Genres />} />
            <Route path="/genre/:title" element={<GenreItems />} />
            <Route
              path="/artist/:username"
              element={
                <ArtistProtector>
                  <ArtistsProfile />
                </ArtistProtector>
              }
            />

            <Route path="/panel/" element={<ArtistPanel />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="playlists" element={<Playlists />} />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
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

          <ConditionalMusicPlayer />
        </MusicPlayerProvider>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;
