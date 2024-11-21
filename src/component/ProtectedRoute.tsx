// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Redirect to login if no token is found
    return <Navigate to="/login" replace />;
  }

  // Render the child component (protected page) if token exists
  return children;
};

export default ProtectedRoute;

// import { Navigate, Outlet } from 'react-router-dom';

// const ProtectedRoute = () => {
//     const isLoggedIn = JSON.parse(window.localStorage.getItem("loggedIn") || "false");

//     return (
//         <div>
//             {isLoggedIn ? <Outlet /> : <Navigate to="login" />}
//         </div>
//     );
// }

// export default ProtectedRoute;
