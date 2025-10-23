import { useParams, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ArtistProtector({ children }: ProtectedRouteProps) {
  const { username } = useParams<{username : string}>();
  const [role, ] = useState<string>("artist");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ... fetch or check permissions
      } catch (e) {
        console.error(e);
      }
    };

  }, [username]);

  if (role === "user") {
    return <Navigate to={`/profile/${String(username)}`} replace />;
  }

  return children;
}
