import { create } from 'zustand';
import { User, UserRole } from '../types';
import { mockUsers } from '../data/mock';

interface AuthState {
  user: User | null;
  role: UserRole | null;
  login: (email: string) => void;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUsers[0], // Default to first mock user for demo
  role: mockUsers[0].role,
  login: (email: string) => {
    const user = mockUsers.find((u) => u.email === email) || mockUsers[0];
    set({ user, role: user.role });
  },
  loginAsRole: (role: UserRole) => {
    const user = mockUsers.find((u) => u.role === role) || mockUsers[0];
    set({ user, role: user.role });
  },
  logout: () => set({ user: null, role: null }),
}));
