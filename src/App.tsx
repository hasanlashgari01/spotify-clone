import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReactQueryProvider from './providers/react-query-provider';
import Profile from './pages/Profile';
// import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  localStorage.setItem(
  'accessToken',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImVtYWlsIjoibWFoZGlAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpc0JhbiI6ZmFsc2UsInN0YXR1cyI6InB1YmxpYyIsImlhdCI6MTc1NjEyNzIwOSwiZXhwIjoxNzU2NzMyMDA5fQ.e3SI5Mqy08lNq3SWD-0Z1Xa6lqB9SlkcWTh_nAz0Els'
);
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route
            path="/Profile"
            element={
              <ProtectedRoute>
         
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;
