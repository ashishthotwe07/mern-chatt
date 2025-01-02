import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User, LogOut, Settings, MessageSquare } from 'lucide-react'; // MessageSquare icon for the chat app
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
    const { authUser, logout } = useAuthStore(); // Zustand store for authUser and logout

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="bg-gray-900 text-white p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo and App Name with Icon */}
                <Link to="/" className="text-xl font-bold flex items-center space-x-2">
                    <MessageSquare className="text-white mt-1" size={24} /> {/* Icon for Chatify */}
                    <span className="text-white text-md">Chatify</span> {/* Smaller name */}
                </Link>

                {/* Desktop Navigation (large screens) */}
                <div className="hidden md:flex space-x-8">
                    {authUser ? (
                        <>
                            <Link to="/profile" className="flex items-center hover:bg-gray-700 p-2 rounded-lg">
                                <User size={20} className="mr-2" /> Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center hover:bg-red-600 p-2 rounded-lg"
                            >
                                <LogOut size={20} className="mr-2" /> Logout
                            </button>
                        </>
                    ) : null}

                    {/* Settings link */}
                    <Link to="/settings" className="flex items-center hover:bg-gray-700 p-2 rounded-lg">
                        <Settings size={20} className="mr-2" /> Settings
                    </Link>
                </div>

                {/* Mobile Navigation (small screens) */}
                <div className="flex md:hidden space-x-4">
                    {authUser ? (
                        <>
                            <Link to="/profile" className="flex items-center hover:bg-gray-700 p-2 rounded-lg">
                                <User size={20} />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center hover:bg-red-600 p-2 rounded-lg"
                            >
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="flex items-center hover:bg-gray-700 p-2 rounded-lg">
                                <User size={20} />
                            </Link>
                            <Link to="/signup" className="flex items-center hover:bg-gray-700 p-2 rounded-lg">
                                <User size={20} />
                            </Link>
                        </>
                    )}

                    <Link to="/settings" className="flex items-center hover:bg-gray-700 p-2 rounded-lg">
                        <Settings size={20} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
