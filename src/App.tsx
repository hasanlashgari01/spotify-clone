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
import GenreItems from './pages/Genres/GenreItems';
import Genres from './pages/Genres/Genres';

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <MusicPlayerProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/playlist/:slug" element={<PlaylistPage />} />
            <Route path="/profile/:username" element={<UsersProfile />}></Route>
            <Route path="/genre" element={<Genres />} />
            <Route path="/genre/:title" element={<GenreItems />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#101720',
                color: '#fff',
                borderRadius: '10px',
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
