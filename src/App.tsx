import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReactQueryProvider from './providers/react-query-provider';
import MusicPlayers  from './components/MusicPlayer/MusicPlayer';
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <MusicPlayers />
        </MusicPlayerProvider>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;
