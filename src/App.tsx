import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
<<<<<<< HEAD
import ReactQueryProvider from "./providers/react-query-provider";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
=======
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/Home";
import ReactQueryProvider from "./providers/react-query-provider";
>>>>>>> header-Erfan

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <Routes>
<<<<<<< HEAD

          <Route path="/" element={<Navigate to="/home" replace />} />
          

          <Route path="/home" element={<HomePage />} />
          

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          

          <Route path="*" element={<div>404 - Page Not Found</div>} />
=======
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
>>>>>>> header-Erfan
        </Routes>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;