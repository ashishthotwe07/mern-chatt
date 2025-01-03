// src/store/useChatStore.js

import {create} from 'zustand';
import axiosInstance from '../lib/axios';
import { toast } from 'react-hot-toast'; // Import the toast for notifications

const useChatStore = create((set ,get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    // Function to fetch the list of users
    getUsers: async () => {
        set({ isUsersLoading: true }); // Set loading state to true while fetching
        try {
            // Fetch users from the API (replace with actual endpoint)
            const response = await axiosInstance.get('/messages/users');

            // Assuming the response has a 'users' field containing the list of users
            set({ users: response.data, isUsersLoading: false });

        } catch (error) {
            console.error('Error fetching users:', error);
            set({ isUsersLoading: false });

        }
    },

    // Function to fetch messages for a specific user
    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            // Fetch messages for the selected user (replace with actual endpoint)
            const response = await axiosInstance.get(`/messages/${userId}`);

            // Assuming the response has a 'messages' field containing the messages
            set({ messages: response.data, isMessagesLoading: false });

        } catch (error) {
            console.error('Error fetching messages:', error);
            set({ isMessagesLoading: false });
        }
    },


    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
          set({ messages: [...messages, res.data] });
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

export default useChatStore;
