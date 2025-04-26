import { useState, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FiX, FiCheck, FiUserPlus, FiMessageSquare } from 'react-icons/fi';

function NotificationPanel({ onClose }) {
  const { user } = useAuth();
  const {
    getPendingRequests,
    acceptFriendRequest,
    declineFriendRequest,
    users,
    newMessages,
    getDecryptedMessage
  } = useChat();

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user || !user.$id) {
        console.error('User not authenticated or missing $id');
        toast.error('Please log in to view notifications');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const requests = await getPendingRequests(user.$id).catch((err) => {
          console.error('Failed to get pending requests:', err);
          throw err;
        });
        
        setIncomingRequests(requests);
        setAllUsers(users);
      } catch (error) {
        console.error('Error loading notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, users]);

  const getUserById = (userId) => {
    return allUsers.find(u => u.$id === userId) || { 
      firstName: 'Unknown', 
      lastName: 'User', 
      username: 'unknown' 
    };
  };

  const handleAccept = async (requestId) => {
    try {
      await acceptFriendRequest(requestId);
      toast.success('Friend request accepted!');
      const requests = await getPendingRequests(user.$id);
      setIncomingRequests(requests);
    } catch (error) {
      console.error('Failed to accept friend request:', error);
      toast.error('Failed to accept request');
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await declineFriendRequest(requestId);
      toast.success('Request declined');
      const requests = await getPendingRequests(user.$id);
      setIncomingRequests(requests);
    } catch (error) {
      console.error('Failed to decline friend request:', error);
      toast.error('Failed to decline request');
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-dark-900 bg-opacity-75 flex items-start justify-end">
        <div className="w-full max-w-md h-full bg-dark-500 shadow-lg overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-400">Loading notifications...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-dark-900 bg-opacity-75 flex items-start justify-end">
      <div className="w-full max-w-md h-full bg-dark-500 shadow-lg overflow-auto">
        <div className="sticky top-0 z-10 p-4 border-b border-dark-300 flex items-center justify-between bg-dark-500">
          <h3 className="text-xl font-semibold text-white">Notifications</h3>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-dark-400 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          <div>
            <h4 className="text-gray-300 font-medium mb-3 flex items-center">
              <FiMessageSquare className="mr-2" /> New Messages
            </h4>
            
            {newMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-dark-400 rounded-lg">
                <div className="w-16 h-16 bg-dark-300 rounded-full flex items-center justify-center mb-3">
                  <FiCheck className="w-8 h-8 text-primary-500" />
                </div>
                <p className="text-gray-400">No new messages</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {newMessages.map((message) => {
                  const sender = getUserById(message.fromUserId);
                  const decryptedMessage = getDecryptedMessage(message);
                  
                  return (
                    <li key={message.$id} className="bg-dark-400 rounded-lg p-4 border border-dark-300">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 flex items-center justify-center">
                            <span className="text-white font-bold">
                              {sender.firstName?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {sender.firstName} {sender.lastName}
                            </p>
                            <p className="text-gray-400 text-sm">@{sender.username}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTime(message.createdAt)}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm truncate">
                        {decryptedMessage.decryptedContent || message.content || 'Unable to decrypt message'}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div>
            <h4 className="text-gray-300 font-medium mb-3 flex items-center">
              <FiUserPlus className="mr-2" /> Friend Requests
            </h4>
            
            {incomingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-dark-400 rounded-lg">
                <div className="w-16 h-16 bg-dark-300 rounded-full flex items-center justify-center mb-3">
                  <FiCheck className="w-8 h-8 text-primary-500" />
                </div>
                <p className="text-gray-400">No pending requests</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {incomingRequests.map((request) => {
                  const sender = getUserById(request.fromUserId);
                  
                  return (
                    <li key={request.$id} className="bg-dark-400 rounded-lg p-4 border border-dark-300">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 flex items-center justify-center">
                            <span className="text-white font-bold">
                              {sender.firstName?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {sender.firstName} {sender.lastName}
                            </p>
                            <p className="text-gray-400 text-sm">@{sender.username}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTime(request.createdAt)}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAccept(request.$id)}
                          className="flex-1 py-2 text-center text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors flex items-center justify-center space-x-1"
                        >
                          <FiCheck className="w-4 h-4" />
                          <span>Accept</span>
                        </button>
                        
                        <button
                          onClick={() => handleDecline(request.$id)}
                          className="flex-1 py-2 text-center text-white bg-dark-300 hover:bg-dark-200 rounded-lg transition-colors flex items-center justify-center space-x-1"
                        >
                          <FiX className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationPanel;