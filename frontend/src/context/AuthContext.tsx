import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { ApiService } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setDemoUser: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('PATIENT');

  useEffect(() => {
    // Auto-login as default guest patient if no token exists for frictionless triage
    const token = localStorage.getItem('his_access_token');
    if (!token) {
      autoLoginGuest();
    } else {
      setUser({
        id: 1,
        username: 'patient_demo',
        role: 'PATIENT',
        is_active: true,
        created_at: new Date().toISOString(),
      });
    }
  }, []);

  const autoLoginGuest = async () => {
    try {
      await ApiService.login('patient_demo', 'password123');
      setUser({
        id: 1,
        username: 'patient_demo',
        role: 'PATIENT',
        is_active: true,
        created_at: new Date().toISOString(),
      });
      setRole('PATIENT');
    } catch (e) {
      console.warn('Auto guest login fallback active');
    }
  };

  const login = async (username: string, password: string) => {
    const data = await ApiService.login(username, password);
    const userRole = data.role || (username.includes('worker') ? 'HEALTH_WORKER' : username.includes('admin') ? 'ADMIN' : 'PATIENT');
    const mockUser: User = {
      id: userRole === 'PATIENT' ? 1 : userRole === 'HEALTH_WORKER' ? 2 : 3,
      username,
      role: userRole,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setUser(mockUser);
    setRole(userRole);
  };

  const setDemoUser = async (selectedRole: UserRole) => {
    const demoUsername = selectedRole === 'PATIENT' ? 'patient_demo' : selectedRole === 'HEALTH_WORKER' ? 'worker_demo' : 'admin_demo';
    try {
      await ApiService.login(demoUsername, 'password123');
    } catch (e) {
      // Fallback
    }
    const mockUser: User = {
      id: selectedRole === 'PATIENT' ? 1 : selectedRole === 'HEALTH_WORKER' ? 2 : 3,
      username: demoUsername,
      role: selectedRole,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setUser(mockUser);
    setRole(selectedRole);
  };

  const logout = () => {
    ApiService.clearTokens();
    setUser(null);
    setRole('PATIENT');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, setDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
