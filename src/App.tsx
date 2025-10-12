import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
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
import Search from './pages/Search';

// Component to conditionally render MusicPlayer
const ConditionalMusicPlayer = () => {
  const location = useLocation();
  const shouldHidePlayer = location.pathname === '/login' || location.pathname === '/register';
  
  return !shouldHidePlayer ? <MusicPlayers /> : null;
};


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
            <Route path="/profile/:username" element={<UsersProfile/>}></Route>
            <Route path='/search' element={<Search />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
          
          <ConditionalMusicPlayer />
        </MusicPlayerProvider>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;
