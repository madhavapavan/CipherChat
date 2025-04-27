import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import { FiShield } from 'react-icons/fi';

function Auth() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  
  useEffect(() => {
    if (location.state?.isLogin !== undefined) {
      setIsLogin(location.state.isLogin);
    }
  }, [location]);
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen w-full bg-dark-500 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 mb-4 bg-dark-400 rounded-full">
          <FiShield className="h-8 w-8 text-primary-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">CipherChat</h1>
        <p className="text-gray-400">Secure, encrypted messaging for everyone</p>
      </div>
      
      {isLogin ? (
        <LoginForm onToggleForm={toggleForm} />
      ) : (
        <RegisterForm onToggleForm={toggleForm} />
      )}
      
      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>End-to-end encrypted chat powered by Appwrite</p>
      </div>
    </div>
  );
}

export default Auth;