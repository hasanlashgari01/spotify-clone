import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ReactQueryProvider from "./providers/react-query-provider";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Navigate to="/home" replace />} />
          

          <Route path="/home" element={<HomePage />} />
          

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          

          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;