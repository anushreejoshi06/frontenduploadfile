// App.tsx
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./component/auth/Signup";
import Login from "./component/auth/Login";
import Main from "./component/adminView/BrandMangCrud/Main";
import Home from "./component/Home";
import SearchData from "./component/adminView/search/SearchData";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./component/ProtectedRoute"; 
import AuthRoute from "./AuthRoute";
// import AuthRoute from "./component/AuthRoute"; // Import AuthRoute

function App() {
  const token = localStorage.getItem('token'); 

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Routes>
        {/* Root route that redirects based on login status */}
        <Route path="/" element={<Navigate to={token ? "/home" : "/login"} replace />} />

        {/* Auth-only routes (redirect if already logged in) */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <Signup />
            </AuthRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/main"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchData />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;


// ----------------------------------------------------------------------
// // import { useState } from "react";
// import "./App.css";
// import { Navigate, Route, Routes } from "react-router-dom";
// import Signup from "./component/auth/Signup";
// import Login from "./component/auth/Login";
// import ProtectedRoute from "./component/ProtectedRoute";
// import Main from "./component/adminView/BrandMangCrud/Main";
// import Home from "./component/Home";
// // import ForgotPassword from "./component/auth/ForgotPassword";
// // import ResetPassword from "./component/auth/ResetPassword";
// import SearchData from "./component/adminView/search/SearchData";
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function App() {
//   const isLoggedIn = JSON.parse(window.localStorage.getItem("loggedIn") || "false");

//   return (
//     <div>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
//       <Routes>
//         {/* Unauthorized routes */}
//         {!isLoggedIn && (
//           <>
//             <Route path="/" element={<Login />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//             {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
//             {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
//           </>
//         )}

//         {/* ProtectedRoute */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/signup" element={<Navigate to="/" />} />
//           <Route path="/login" element={<Navigate to="/" />} />
//           <Route path="/" element={<Navigate to="/home" />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/main" element={<Main />} />
//           <Route path="/search" element={<SearchData />} />
//         </Route>
//       </Routes>
//     </div>
//   );
// }

// export default App;
