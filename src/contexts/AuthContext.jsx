import { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/appwrite';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const profile = await userService.getProfile(currentUser.$id);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (email, password) => {
    try {
      const response = await authService.createAccount(email, password);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setUserProfile(null); // ensure hasProfile = false immediately after registration
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      await authService.login(email, password);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const profile = await userService.getProfile(currentUser.$id);
        setUserProfile(profile);
      }

      return currentUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const createProfile = async (firstName, lastName, username) => {
    if (!user) return null;

    try {
      const profile = await userService.createProfile(
        user.$id,
        firstName,
        lastName,
        username
      );
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Create profile error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    register,
    login,
    logout,
    createProfile,
    isAuthenticated: !!user,
    hasProfile: !!userProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
