
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "hospital";
  profilePicture?: string;
  specialization?: string; // For doctors
  hospitalName?: string; // For hospital accounts
  location?: string; // For hospitals and doctors
  experience?: number; // For doctors (years)
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: "patient" | "doctor" | "hospital") => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: "patient" | "doctor" | "hospital") => Promise<void>;
  updateUserProfile: (updatedData: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in a real app this would come from a backend API
const MOCK_USERS = [
  {
    id: "p1",
    name: "John Doe",
    email: "patient@example.com",
    password: "password",
    role: "patient" as const,
    profilePicture: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "d1",
    name: "Dr. Jane Smith",
    email: "doctor@example.com",
    password: "password",
    role: "doctor" as const,
    profilePicture: "https://i.pravatar.cc/150?img=2",
    specialization: "Cardiology",
    hospitalName: "General Hospital",
    location: "New York, NY",
    experience: 12,
  },
  {
    id: "h1",
    name: "General Hospital",
    email: "hospital@example.com",
    password: "password",
    role: "hospital" as const,
    profilePicture: "https://i.pravatar.cc/150?img=3",
    location: "Boston, MA",
  },
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in local storage
    const savedUser = localStorage.getItem("mediflow_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: "patient" | "doctor" | "hospital") => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password && u.role === role
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("mediflow_user", JSON.stringify(userWithoutPassword));
      toast({
        title: "Logged in successfully",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw new Error("Invalid credentials");
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mediflow_user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const register = async (name: string, email: string, password: string, role: "patient" | "doctor" | "hospital") => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userExists = MOCK_USERS.some(u => u.email === email);
    
    if (userExists) {
      toast({
        title: "Registration failed",
        description: "User with this email already exists",
        variant: "destructive",
      });
      setIsLoading(false);
      throw new Error("User already exists");
    }
    
    // In a real app, this would be an API call to register the user
    const newUser = {
      id: `${role[0]}${MOCK_USERS.length + 1}`,
      name,
      email,
      role,
      profilePicture: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    };
    
    setUser(newUser);
    localStorage.setItem("mediflow_user", JSON.stringify(newUser));
    toast({
      title: "Registration successful",
      description: `Welcome, ${name}!`,
    });
    
    setIsLoading(false);
  };

  const updateUserProfile = async (updatedData: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user data
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("mediflow_user", JSON.stringify(updatedUser));
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
    
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
