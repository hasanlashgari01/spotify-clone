import { useParams, Navigate } from 'react-router-dom';
import {  useState } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export function ArtistProtector({ children }: ProtectedRouteProps) {
  const { username } = useParams<{username : string}>();
  const [role, ] = useState<string>("artist");



  if (role === "user") {
    return <Navigate to={`/profile/${String(username)}`} replace />;
  }

  return children;
}
