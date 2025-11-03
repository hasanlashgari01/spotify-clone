import './styles/App.css';
import GenreItems from './pages/Genres/GenreItems';
import Genres from './pages/Genres/Genres';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { AdminProtector } from './components/Protect Route/AdminProtector';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
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
import Playlists from './pages/admin/Playlists.tsx';
import Analytics from './pages/admin/Analytics.tsx';
import Settings from './pages/admin/Settings.tsx';

function App() {

  return (
    <ReactQueryProvider>
      <BrowserRouter>
      <ScrollToTop />
        <MusicPlayerProvider>
       
            

            
              <Routes>
                {/* صفحات احراز هویت بدون لایه عمومی */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* لایه عمومی شامل Navbar و MusicPlayer */}
                <Route element={<AppLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/playlist/:slug" element={<PlaylistPage />} />
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

                  {/* پنل ادمین */}
                  <Route
                    path="/admin"
                    element={
                      <AdminProtector>
                        <AdminLayout />
                      </AdminProtector>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="playlists" element={<Playlists />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Route>
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



        </MusicPlayerProvider>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;