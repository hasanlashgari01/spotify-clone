import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MusicPlayers from './components/MusicPlayer/MusicPlayer';
import { ProtectedRoute } from './components/Protect Route/ProtectedRoute';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PlaylistPage from './pages/PlaylistPage';
import Profile from './pages/Profile';
import RegisterPage from './pages/RegisterPage';
import ReactQueryProvider from './providers/react-query-provider';
import UsersProfile from './pages/UsersProfile';
import { Toaster } from 'react-hot-toast';
import { MusicSB } from './components/music-sidebar/MusicSb';
import { useState } from 'react';

function App() {
  const [fullimize, setFullimize] = useState<boolean>(false);

  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <MusicPlayerProvider>
          <div className="flex flex-row w-[100vw] h-[100vh] overflow-hidden">
            <MusicSB />

            <div className="flex-1 overflow-auto bg-[#0c1218] text-white">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/playlist/:slug" element={<PlaylistPage />} />
                <Route path="/profile/:username" element={<UsersProfile />} />
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
                padding: '5px',
              },
            }}
          />

          <MusicPlayers />
        </MusicPlayerProvider>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;
