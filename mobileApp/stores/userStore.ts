import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

// Définition du type de l'utilisateur
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  token: string;
};

// Définition du Store Zustand
type UserStore = {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
};

// Création du store avec persistance (AsyncStorage)
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-storage', // Nom de l'entrée dans AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // ✅ Convertit AsyncStorage en format JSON pour Zustand
    }
  )
);
