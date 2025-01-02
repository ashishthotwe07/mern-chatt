// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import Navbar from './components/Navbar'; // Import the Navbar component

// Import components for the new routes
import Signup from './pages/SignUp';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Home from './pages/Home';


const App = () => {
  return (
    <div>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />      {/* Home route */}
        <Route path="/signup" element={<Signup />} />  {/* Signup route */}
        <Route path="/login" element={<Login />} />  {/* Login route */}
        <Route path="/settings" element={<Settings />} /> {/* Settings route */}
        <Route path="/profile" element={<Profile />} /> {/* Profile route */}
      </Routes>
    </div>
  );
};

export default App;
