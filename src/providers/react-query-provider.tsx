import { QueryClientProvider } from '@tanstack/react-query';
import client from '../config/react-query';

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
