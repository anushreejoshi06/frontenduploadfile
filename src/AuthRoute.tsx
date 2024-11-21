// AuthRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface AuthRouteProps {
  children: JSX.Element;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token) {
    // Redirect to home if user is already logged in
    return <Navigate to="/home" replace />;
  }

  // Render the children (login/signup page) if not logged in
  return children;
};

export default AuthRoute;
