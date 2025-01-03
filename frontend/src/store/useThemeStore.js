// src/store/useThemeStore.js

import { create } from 'zustand';

const useThemeStore = create((set) => ({
  // Initial state: Load from local storage or default to 'light'
  theme: localStorage.getItem('theme') || 'light',

  // Action to set the theme
  setTheme: (newTheme) => {
    localStorage.setItem('theme', newTheme); // Save to local storage
    set({ theme: newTheme });
  },
}));

export default useThemeStore;
