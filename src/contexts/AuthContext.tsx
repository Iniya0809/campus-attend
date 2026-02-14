import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type UserRole = "admin" | "teacher" | "student";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  assignedClasses?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock credentials
const mockUsers: Record<UserRole, User> = {
  admin: {
    id: "ADM001",
    name: "Dr. Rajesh Kumar",
    email: "admin@college.edu",
    role: "admin",
    avatar: "RK",
  },
  teacher: {
    id: "TCH001",
    name: "Prof. Anita Sharma",
    email: "teacher@college.edu",
    role: "teacher",
    avatar: "AS",
    department: "Computer Science",
    assignedClasses: ["CS-A", "CS-B"],
  },
  student: {
    id: "STU001",
    name: "Aarav Sharma",
    email: "student@college.edu",
    role: "student",
    avatar: "AS",
    department: "Computer Science",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, _password: string, role: UserRole): boolean => {
    // Mock authentication
    if (email && _password) {
      setUser(mockUsers[role]);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
