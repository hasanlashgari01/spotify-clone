import './styles/App.css';
import GenreItems from './pages/Genres/GenreItems';
import Genres from './pages/Genres/Genres';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MusicPlayers from './components/MusicPlayer/MusicPlayer';
import PlaylistPage from './pages/PlaylistPage';
import Profile from './pages/Profile';
import ReactQueryProvider from './providers/react-query-provider';
import RegisterPage from './pages/RegisterPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/Protect Route/ProtectedRoute';
import { MusicPlayerProvider } from './context/MusicPlayerContext';

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <MusicPlayerProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/genre" element={<Genres />} />
            <Route path="/genre/:title" element={<GenreItems />} />
            <Route path="/playlist/:slug" element={<PlaylistPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
          <MusicPlayers />
        </MusicPlayerProvider>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;
