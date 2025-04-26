import { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import RegisterForm from '../components/Auth/RegisterForm';
import { FiLock } from 'react-icons/fi';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen w-full bg-dark-500 flex flex-col items-center justify-start p-4 pt-2">
      <div className="w-full max-w-md text-center mb-4">
        <div className="inline-flex items-center justify-center p-3 mb-3 bg-dark-400 rounded-full">
          <FiLock className="h-7 w-7 text-primary-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">CipherChat</h1>
        <p className="text-gray-400 text-sm">Secure, encrypted messaging for everyone</p>
      </div>
      
      {isLogin ? (
        <LoginForm onToggleForm={toggleForm} />
      ) : (
        <RegisterForm onToggleForm={toggleForm} />
      )}
      
      {/* Footer */}
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>End-to-end encrypted chat powered by Madhava</p>
      </div>
    </div>
  );
}

export default Auth;