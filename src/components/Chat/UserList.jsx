import { useChat } from '../../contexts/ChatContext';
import { FiUserPlus, FiCheck, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';

function UserList() {
  const { 
    filteredUsers, 
    selectUser, 
    selectedUser, 
    sendFriendRequest // ✅ Corrected here
  } = useChat();

  const handleSendRequest = async (userId) => {
    try {
      const result = await sendFriendRequest(userId); // ✅ And here
      if (result) {
        toast.success('Chat request sent successfully!');
      }
    } catch (error) {
      console.error('Error sending chat request:', error);
      toast.error('Failed to send chat request.');
    }
  };

  return (
    <div className="py-2">
      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <div className="w-16 h-16 bg-dark-400 rounded-full flex items-center justify-center mb-3">
            <FiUserPlus className="w-8 h-8 text-gray-500" />
          </div>
          <p className="text-gray-400">No users found</p>
        </div>
      ) : (
        <ul>
          {filteredUsers.map((user) => (
            <li 
              key={user.$id}
              className={`px-4 py-3 flex items-center justify-between hover:bg-dark-400 cursor-pointer transition-colors ${
                selectedUser && selectedUser.$id === user.$id ? 'bg-dark-400' : ''
              }`}
              onClick={() => selectUser(user)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h4 className="text-white font-medium">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-gray-400 text-sm">@{user.username}</p>
                </div>
              </div>
              
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendRequest(user.$id);
                  }}
                  className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-dark-300 transition-colors"
                  title="Send chat request"
                >
                  <FiMessageSquare className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;
