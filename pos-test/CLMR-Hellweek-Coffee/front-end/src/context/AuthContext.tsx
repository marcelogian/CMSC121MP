import React, { createContext, useContext, useState } from 'react';

type Role = 'cashier' | 'manager' | 'admin';
type User = { email: string; role: Role } | null;

interface AuthContextType {
  user: User;
  login: (email: string, password: string, role: Role) => boolean;
  signup: (email: string, password: string, role: Role) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  const login = (email: string, password: string, role: Role): boolean => {
    const key = `${role}:${email}`;
    const storedUser = localStorage.getItem(key);

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.password === password) {
        setUser({ email, role });
        return true;
      }
    }

    return false;
  };

  const signup = (email: string, password: string, role: Role): boolean => {
    const key = `${role}:${email}`;
    const newUser = { email, password };
    localStorage.setItem(key, JSON.stringify(newUser));
    setUser({ email, role });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
