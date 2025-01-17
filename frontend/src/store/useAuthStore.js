// src/store/useAuthStore.js

import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,


  // Async function to check authentication status
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },


  // Async function for user signup
  signup: async (userData) => {
    set({ isSigningUp: true }); // Start signup process

    try {
      const response = await axiosInstance.post('/auth/signup', userData);

      if (response.status === 201) {
        toast.success('Account created successfully!');
        set({ authUser: response.data, isSigningUp: false });
        get().connectSocket();
      } else {
        toast.error('Signup failed, try again!');
        set({ isSigningUp: false });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.response?.data?.message || 'An error occurred during signup.'); // Show error toast with message from API or default error message
      set({ isSigningUp: false, errorMessage: error.response?.data?.message || 'An error occurred during signup.' });
    }
  },


  // Async function for user logout
  logout: async () => {
    try {
      await axiosInstance.post('/auth/signout');
      toast.success('Logged out successfully!');
      set({ authUser: null });
      get().disconnectSocket();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout.');
    }
  },


  // Async function for user signin (login)
  login: async (userData) => {
    set({ isLoggingIn: true }); // Start login process

    try {
      const response = await axiosInstance.post('/auth/signin', userData);

      if (response.status === 200) {
        toast.success('Logged in successfully!');
        set({ authUser: response.data, isLoggingIn: false });
        get().connectSocket();
      } else {
        toast.error('Login failed, try again!');
        set({ isLoggingIn: false });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'An error occurred during login.');
      set({ isLoggingIn: false, errorMessage: error.response?.data?.message || 'An error occurred during login.' });
    }
  },


  // Async function to update profile image
  updateProfile: async (file) => {
    set({ isUpdatingProfile: true });

    const formData = new FormData();
    formData.append('profilePic', file);  // Append the file here

    try {
      // Send the PUT request to update the profile image
      const response = await axiosInstance.put('/auth/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // This is important for file uploads
        },
      });

      if (response.status === 200) {
        toast.success('Profile image updated successfully!');
        set({ authUser: response.data, isUpdatingProfile: false });
      } else {
        toast.error('Profile image update failed, try again!');
        set({ isUpdatingProfile: false });
      }
    } catch (error) {
      console.error('Update Profile error:', error);
      toast.error(error.response?.data?.message || 'An error occurred while updating profile image.');
      set({ isUpdatingProfile: false });
    }
  },

  // Update account information (email, name, password)
  updateAccount: async (updatedData) => {
    try {
      const response = await axiosInstance.put('/auth/update-account', updatedData);

      if (response.status === 200) {
        toast.success('Account updated successfully!');
        set({ authUser: response.data });
      } else {
        toast.error('Account update failed, try again!');
      }
    } catch (error) {
      console.error('Update Account error:', error);
      toast.error(error.response?.data?.message || 'An error occurred while updating account.');
    }
  },

  // Delete account
  deleteAccount: async () => {
    try {
      const response = await axiosInstance.delete('/auth/delete-account');

      if (response.status === 200) {
        toast.success('Account deleted successfully!');
        set({ authUser: null });
        get().disconnectSocket();
      } else {
        toast.error('Account deletion failed, try again!');
      }
    } catch (error) {
      console.error('Delete Account error:', error);
      toast.error(error.response?.data?.message || 'An error occurred while deleting account.');
    }
  },


  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

}));

export default useAuthStore;
