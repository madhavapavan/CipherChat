import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

function ProfileForm() {
  const { createProfile, user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !username) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      await createProfile(firstName, lastName, username);
      toast.success('Profile created successfully!');
    } catch (error) {
      console.error('Profile creation error:', error);
      toast.error(error.message || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-dark-400 rounded-xl shadow-glass backdrop-blur-glass animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Complete Your Profile</h1>
        <p className="mt-2 text-gray-300">Tell us a bit about yourself</p>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-md -space-y-px">
          <div className="mb-5">
            <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-gray-300">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="appearance-none relative block w-full px-10 py-3 border border-gray-600 placeholder-gray-500 text-white rounded-lg bg-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your first name"
              />
            </div>
          </div>
          
          <div className="mb-5">
            <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-gray-300">
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="appearance-none relative block w-full px-10 py-3 border border-gray-600 placeholder-gray-500 text-white rounded-lg bg-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-300">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">@</span>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none relative block w-full px-10 py-3 border border-gray-600 placeholder-gray-500 text-white rounded-lg bg-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Choose a username"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white font-medium bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-500 hover:to-secondary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition duration-150 ease-in-out hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating profile...' : 'Complete Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;