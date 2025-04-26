import { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/appwrite';
import toast from 'react-hot-toast';
import { FiSearch, FiUsers, FiBell, FiSettings, FiX, FiCheck } from 'react-icons/fi';
import UserList from './UserList';
import NotificationPanel from './NotificationPanel';

function Sidebar() {
  const { user, userProfile, logout } = useAuth();
  const { 
    searchQuery, 
    setSearchQuery, 
    unreadCount,
    chatRequests,
    acceptFriendRequest,
    declineFriendRequest,
    logoutCleanup
  } = useChat();
  
  const [activeTab, setActiveTab] = useState('users');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');
  const [username, setUsername] = useState(userProfile?.username || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowSettings(false);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowNotifications(false);
    setFirstName(userProfile?.firstName || '');
    setLastName(userProfile?.lastName || '');
    setUsername(userProfile?.username || '');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user || !user.$id) {
      toast.error('Please log in to update profile');
      return;
    }

    if (!firstName.trim() || !username.trim()) {
      toast.error('First name and username are required');
      return;
    }

    setIsUpdating(true);
    try {
      await userService.updateProfile(user.$id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim()
      });
      toast.success('Profile updated successfully');
      setShowSettings(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      logoutCleanup();
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="w-full md:w-80 h-full bg-dark-500 border-r border-dark-300 flex flex-col">
      <div className="p-4 border-b border-dark-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {userProfile?.firstName?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h3 className="text-white font-semibold truncate">
                {userProfile?.firstName} {userProfile?.lastName}
              </h3>
              <p className="text-gray-400 text-sm truncate">@{userProfile?.username}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleSettings}
              className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-dark-400 transition-colors"
              aria-label="Settings"
            >
              <FiSettings className="w-5 h-5" />
            </button>
            
            <button 
              onClick={toggleNotifications}
              className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-dark-400 transition-colors"
              aria-label="Notifications"
            >
              <FiBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-dark-400 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="px-4 border-b border-dark-300">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2 flex items-center space-x-2 ${
              activeTab === 'users'
                ? 'text-primary-500 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-white'
            }`}
            aria-label="Users"
          >
            <FiUsers className="w-5 h-5" />
            <span>Users</span>
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {activeTab === 'users' && <UserList />}
      </div>
      
      {showNotifications && (
        <NotificationPanel onClose={toggleNotifications} />
      )}
      
      {showSettings && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-dark-900 bg-opacity-75 flex items-start justify-end">
          <div className="w-full max-w-md h-full bg-dark-500 shadow-lg overflow-auto">
            <div className="sticky top-0 z-10 p-4 border-b border-dark-300 flex items-center justify-between bg-dark-500">
              <h3 className="text-xl font-semibold text-white">Settings</h3>
              <button 
                onClick={toggleSettings}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-dark-400 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full py-2 px-3 bg-dark-400 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full py-2 px-3 bg-dark-400 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full py-2 px-3 bg-dark-400 border border-dark-300 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 py-2 text-center text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center justify-center space-x-1 disabled:opacity-50"
                  >
                    <FiCheck className="w-4 h-4" />
                    <span>{isUpdating ? 'Updating...' : 'Save'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={toggleSettings}
                    className="flex-1 py-2 text-center text-white bg-dark-300 hover:bg-dark-200 rounded-lg transition-colors flex items-center justify-center space-x-1"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4 border-t border-dark-300">
        <button
          onClick={handleLogout}
          className="w-full py-2 text-center text-white bg-dark-400 hover:bg-dark-300 rounded-lg transition-colors"
          aria-label="Log out"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;