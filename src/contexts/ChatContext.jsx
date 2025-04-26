import { createContext, useContext, useState, useEffect } from 'react'; 
import {
  userService,
  messageService,
  requestService,
  subscribeToMessages,
  subscribeToRequests,
  subscribeToUsers
} from '../services/appwrite';
import {
  encryptMessage,
  decryptMessage,
  encryptKey,
  decryptKey,
  deriveSharedKey
} from '../utils/encryption';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { user, userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [chatRequests, setChatRequests] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const DATABASE_ID = '680a7646000a1490e095';
  const MESSAGES_COLLECTION_ID = '680a7bbf001882caf847';
  const REQUESTS_COLLECTION_ID = '680a7c790016f8738438';
  const USERS_COLLECTION_ID = '680a7b9800297b2cc88c';

  useEffect(() => {
    if (user) {
      loadUsers();
      loadChatRequests();
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(user =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  useEffect(() => {
    if (!user) return;

    const messageUnsubscribe = subscribeToMessages((response) => {
      console.log('ChatContext message event:', response);
      if (response.events.includes(`databases.${DATABASE_ID}.collections.${MESSAGES_COLLECTION_ID}.documents.*.create`)) {
        const message = response.payload;
        if (message.toUserId === user.$id || message.fromUserId === user.$id) {
          setMessages((prevMessages) => {
            if (prevMessages.some((msg) => msg.$id === message.$id)) {
              return prevMessages;
            }
            return [...prevMessages, message].sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            );
          });
          if (message.toUserId === user.$id) {
            setNewMessages((prev) => {
              if (prev.some((msg) => msg.$id === message.$id)) {
                return prev;
              }
              return [...prev, message].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              );
            });
            if (!selectedUser || message.fromUserId !== selectedUser.$id) {
              setUnreadCount((prev) => prev + 1);
            }
          }
        }
      }
    });

    const requestUnsubscribe = subscribeToRequests((response) => {
      console.log('ChatContext request event:', response);
      const newRequest = response.payload;
      if (response.events.includes(`databases.${DATABASE_ID}.collections.${REQUESTS_COLLECTION_ID}.documents.*.create`)) {
        if (newRequest.toUserId === user.$id && newRequest.status === 'pending') {
          setChatRequests((prevRequests) => [...prevRequests, newRequest]);
          setUnreadCount((prev) => prev + 1);
        }
      } else if (response.events.includes(`databases.${DATABASE_ID}.collections.${REQUESTS_COLLECTION_ID}.documents.*.update`)) {
        setChatRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.$id === newRequest.$id ? newRequest : request
          ).filter((request) => request.status === 'pending')
        );
      }
    });

    const userUnsubscribe = subscribeToUsers((response) => {
      console.log('ChatContext user event:', response);
      if (response.events.includes(`databases.${DATABASE_ID}.collections.${USERS_COLLECTION_ID}.documents.*.update`)) {
        const updatedUser = response.payload;
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.$id === updatedUser.$id ? updatedUser : user
          )
        );
        setFilteredUsers((prevFiltered) =>
          prevFiltered.map((user) =>
            user.$id === updatedUser.$id ? updatedUser : user
          )
        );
      }
    });

    return () => {
      messageUnsubscribe();
      requestUnsubscribe();
      userUnsubscribe();
    };
  }, [user]);

  const loadUsers = async () => {
    if (!user) return;
    try {
      const usersList = await userService.listUsers(user.$id);
      setUsers(usersList);
      setFilteredUsers(usersList);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const listUsers = async (currentUserId) => {
    try {
      return await userService.listUsers(currentUserId);
    } catch (error) {
      console.error('Error listing users:', error);
      return [];
    }
  };

  const loadChatRequests = async () => {
    if (!user) return;
    try {
      const requests = await requestService.getRequests(user.$id);
      setChatRequests(requests);
      setUnreadCount(requests.length);
    } catch (error) {
      console.error('Error loading chat requests:', error);
    }
  };

  const getSentRequests = async (userId) => {
    try {
      const requests = await requestService.getSentRequests(userId);
      return requests.filter(req => req.status === 'pending');
    } catch (error) {
      console.error('Error getting sent requests:', error);
      return [];
    }
  };

  const selectUser = async (selectedUser) => {
    setSelectedUser(selectedUser);
    try {
      setLoading(true);
      const messagesList = await messageService.getMessages(user.$id, selectedUser.$id);
      setMessages((prevMessages) => {
        const existingIds = new Set(messagesList.map((msg) => msg.$id));
        const filteredPrev = prevMessages.filter((msg) => !existingIds.has(msg.$id));
        return [...filteredPrev, ...messagesList].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      });
      setUnreadCount((prev) => {
        const chatMessages = messages.filter(
          (msg) => msg.toUserId === user.$id && msg.fromUserId === selectedUser.$id
        );
        return Math.max(0, prev - chatMessages.length);
      });
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (toUserId) => {
    if (!user) return false;
    try {
      await requestService.sendRequest(user.$id, toUserId);
      await loadChatRequests();
      return true;
    } catch (error) {
      console.error('Error sending friend request:', error);
      return false;
    }
  };

  const sendMessage = async (fromUserId, toUserId, content, fileId = null) => {
    try {
      const sharedKey = deriveSharedKey(fromUserId, toUserId);
      const encryptedContent = encryptMessage(content, sharedKey);
      const encryptedKey = encryptKey(sharedKey, toUserId);
      
      await messageService.sendMessage(
        fromUserId,
        toUserId,
        encryptedContent,
        encryptedKey,
        fileId
      );
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  const getDecryptedMessage = (message) => {
    if (!user) return { content: 'Unable to decrypt message' };
    try {
      const isRecipient = message.toUserId === user.$id;
      const sharedKey = isRecipient
        ? decryptKey(message.encryptedKey, user.$id)
        : deriveSharedKey(user.$id, message.toUserId);
      const decryptedContent = decryptMessage(message.content, sharedKey);
      return {
        ...message,
        decryptedContent
      };
    } catch (error) {
      console.error('Error decrypting message:', error);
      return {
        ...message,
        decryptedContent: message.content || 'Unable to decrypt message'
      };
    }
  };

  const areFriends = async (userId1, userId2) => {
    try {
      const user1 = await userService.getProfile(userId1);
      return (user1.friends || []).includes(userId2);
    } catch (error) {
      console.error('Error checking friendship:', error);
      return false;
    }
  };

  const getPendingRequests = async (userId) => {
    try {
      const requests = await requestService.getRequests(userId);
      return requests.filter(req => req.status === 'pending');
    } catch (error) {
      console.error('Error getting pending requests:', error);
      return [];
    }
  };

  const getFriendshipStatus = async (otherUserId) => {
    if (!user) return 'none';
    try {
      const isFriend = await areFriends(user.$id, otherUserId);
      if (isFriend) return 'accepted';
      const requests = await getPendingRequests(user.$id);
      const request = requests.find(req => 
        req.fromUserId === otherUserId || req.toUserId === otherUserId
      );
      if (!request) return 'none';
      if (request.fromUserId === user.$id) return 'pending';
      if (request.toUserId === user.$id) return 'requested';
      return request.status;
    } catch (error) {
      console.error('Error getting friendship status:', error);
      return 'none';
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      await requestService.acceptRequest(requestId);
      await loadChatRequests();
      await loadUsers();
      if (selectedUser) {
        await selectUser(selectedUser);
      }
      return true;
    } catch (error) {
      console.error('Error accepting friend request:', error);
      return false;
    }
  };

  const declineFriendRequest = async (requestId) => {
    try {
      await requestService.rejectRequest(requestId);
      await loadChatRequests();
      return true;
    } catch (error) {
      console.error('Error declining friend request:', error);
      return false;
    }
  };

  const logoutCleanup = () => {
    setMessages([]);
    setNewMessages([]);
    setChatRequests([]);
    setUsers([]);
    setFilteredUsers([]);
    setSelectedUser(null);
    setUnreadCount(0);
  };

  const value = {
    users,
    filteredUsers,
    selectedUser,
    messages,
    newMessages,
    chatRequests,
    unreadCount,
    loading,
    searchQuery,
    setSearchQuery,
    selectUser,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    sendMessage,
    getDecryptedMessage,
    areFriends,
    getPendingRequests,
    getSentRequests,
    getFriendshipStatus,
    refreshUsers: loadUsers,
    listUsers,
    refreshRequests: loadChatRequests,
    logoutCleanup
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}