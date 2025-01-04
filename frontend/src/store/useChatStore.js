import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import useAuthStore from "./useAuthStore";

const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

      // Add the sent message to the current chat
      set({ messages: [...messages, res.data] });

      get().getUsers();

    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const { messages, users } = get();

      // If the message is from the selected user, add it to the current messages list
      if (newMessage.senderId === selectedUser._id) {
        set({
          messages: [...messages, newMessage],
        });
      }

      // Also, update the users list for the sender's last message
      set({
        users: users.map(user =>
          user._id === newMessage.senderId
            ? { ...user, lastMessage: newMessage }  // Update the sender's last message
            : user
        ),
      });

      get().getUsers();  // Refresh the users list (optional)
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },



  // New Functionality - Clear Chat
  clearChat: async () => {
    const { selectedUser } = get();
    try {
      // Send a request to the backend to clear the chat between the users
      await axiosInstance.delete(`/messages/clearChat/${selectedUser._id}`);

      // Clear the messages locally as well
      set({ messages: [] });
      get().getUsers();

      toast.success("Chat cleared successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // New Functionality - Delete Single Message
  deleteMessage: async (messageId) => {
    try {
      // Send a request to the backend to delete the message by its ID
      await axiosInstance.delete(`/messages/deleteMessage/${messageId}`);

      // Remove the deleted message from the messages list
      set({ messages: get().messages.filter(msg => msg._id !== messageId) });
      get().getUsers();

      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },


  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

export default useChatStore;
