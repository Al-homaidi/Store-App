import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import { storage } from '@/utils/storage';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Mock user database for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    password: 'password123',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await storage.getItem('user');
        if (userJson) {
          setUser(JSON.parse(userJson));
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // For demo purposes, accept any password for test@test.com
      if (email.toLowerCase() === 'test@test.com') {
        const testUser = MOCK_USERS[0];
        const { password: _, ...userWithoutPassword } = testUser;
        setUser(userWithoutPassword);
        await storage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }

      // For other users, check both email and password
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        await storage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Check if user already exists
      const userExists = MOCK_USERS.some((u) => u.email === email);
      if (userExists) {
        return false;
      }

      // Create new user
      const newUser = {
        id: String(MOCK_USERS.length + 1),
        name,
        email,
        password,
      };

      // Add to mock database
      MOCK_USERS.push(newUser);

      // Set user in state and storage (without password)
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      await storage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Save that onboarding is completed
      await storage.setItem('onboardingComplete', 'true');
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await storage.removeItem('user');
      setUser(null);
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};