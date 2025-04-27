import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-full bg-dark-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Profile route - only for authenticated users without profiles
const ProfileRoute = ({ children }) => {
  const { isAuthenticated, hasProfile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-full bg-dark-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (hasProfile) {
    return <Navigate to="/chat" replace />;
  }
  
  return children;
};

// Chat route - only for authenticated users with profiles
const ChatRoute = ({ children }) => {
  const { isAuthenticated, hasProfile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-full bg-dark-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (!hasProfile) {
    return <Navigate to="/profile" replace />;
  }
  
  return children;
};

// Auth route - redirect to appropriate page if already authenticated
const AuthRoute = ({ children }) => {
  const { isAuthenticated, hasProfile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-full bg-dark-500 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    if (hasProfile) {
      return <Navigate to="/chat" replace />;
    } else {
      return <Navigate to="/profile" replace />;
    }
  }
  
  return children;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="/profile" element={<ProfileRoute><Profile /></ProfileRoute>} />
        <Route path="/chat" element={<ChatRoute><Chat /></ChatRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#2D2D2D',
            color: '#fff',
            border: '1px solid #363636',
          },
          success: {
            iconTheme: {
              primary: '#00FFA3',
              secondary: '#2D2D2D',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF5757',
              secondary: '#2D2D2D',
            },
          },
        }}
      />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;