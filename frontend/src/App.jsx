import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Routes and Route
import { Loader } from 'lucide-react';
import Navbar from './components/Navbar'; // Import the Navbar component
import useAuthStore from './store/useAuthStore'; // Import the Zustand store
import { Toaster } from 'react-hot-toast'; // Import Toaster

// Import components for the new routes
import Signup from './pages/SignUp';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Home from './pages/Home';
import useThemeStore from './store/useThemeStore';

const App = () => {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();

  const {theme} = useThemeStore();

  // Check authentication status when the app loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // console.log({ authUser });

  // If checking authentication, show the loader
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        {/* Home route - only accessible if user is authenticated */}
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />

        {/* Signup and Login routes - Redirect to Home if user is authenticated */}
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />

        {/* Protected routes: Settings and Profile - only accessible if user is authenticated */}
        <Route
          path="/settings"
          element={<Settings />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
