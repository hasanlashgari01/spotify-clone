import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReactQueryProvider from './providers/react-query-provider';
import Profile from './pages/Profile';
import HomePage from './pages/HomePage';
import { ProtectedRoute } from './components/Protect Route/ProtectedRoute';
import PlaylistPage from './pages/PlaylistPage';

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/playlist/:slug" element={<PlaylistPage/>} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;
