import { BrowserRouter, Routes } from 'react-router';
import ReactQueryProvider from './providers/react-query-provider';

function App() {
  return (
    <ReactQueryProvider>
      <BrowserRouter>
        <Routes>
          {/* Route */}
        </Routes>
      </BrowserRouter>
    </ReactQueryProvider>
  );
}

export default App;
