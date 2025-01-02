import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react'; // importing lucide-react icons
import { toast } from 'react-hot-toast'; // Importing react-hot-toast
import { Loader } from 'lucide-react'; // Importing the loader component
import useAuthStore from '../store/useAuthStore';
import { Link } from 'react-router-dom'; // Importing Link for navigation

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const { isLoggingIn, login } = useAuthStore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        let isValid = true;

        if (!formData.email) {
            toast.error('Email is required.');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) { // Email format check
            toast.error('Please enter a valid email address.');
            isValid = false;
        }

        if (!formData.password) {
            toast.error('Password is required.');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form and prevent submission if invalid
        if (!validateForm()) {
            return;
        }

        try {
            await login(formData);
        } catch (error) {
            toast.error('Error during login. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800"> {/* Darker background */}
            <form
                onSubmit={handleSubmit}
                
                className="bg-gray-900 p-6 rounded-lg shadow-lg w-full sm:w-96 border-2 border-gray-600"
            >
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-300">Login to Your Account</h2>

                {/* Email */}
                <div className="mb-4">
                    <label className="flex items-center border-2 border-gray-600 p-2 rounded-md w-full bg-gray-700 hover:bg-gray-600 focus-within:ring-2 focus-within:ring-gray-500">
                        <Mail className="text-gray-400 mr-2" size={20} />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full outline-none bg-transparent text-gray-300"
                        />
                    </label>
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label className="flex items-center border-2 border-gray-600 p-2 rounded-md w-full bg-gray-700 hover:bg-gray-600 focus-within:ring-2 focus-within:ring-gray-500">
                        <Lock className="text-gray-400 mr-2" size={20} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full outline-none bg-transparent text-gray-300"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 ml-2"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </label>
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-500"
                    >
                        {isLoggingIn ? (
                            <div className="flex justify-center">
                                <Loader className="animate-spin" size={20} />
                            </div>
                        ) : (
                            'Login'
                        )}
                    </button>
                </div>

                {/* Sign Up Link */}
                <div className="mt-4 text-center">
                    <p className="text-sm text-indigo-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-gray-500 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
