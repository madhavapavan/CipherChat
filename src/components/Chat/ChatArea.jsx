import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { fileService } from '../../services/appwrite';
import { FiSend, FiPaperclip, FiFile, FiImage, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import MessageBubble from './MessageBubble';

function ChatArea() {
  const { user } = useAuth();
  const {
    selectedUser,
    messages,
    sendMessage,
    getDecryptedMessage,
    areFriends,
    sendFriendRequest,
    acceptFriendRequest,
    getPendingRequests
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [isRequestFromThem, setIsRequestFromThem] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Check friendship status and requests when selectedUser changes
  useEffect(() => {
    const checkStatus = async () => {
      if (!selectedUser || !user) return;
      
      try {
        // Check if users are friends
        const friends = await areFriends(user.$id, selectedUser.$id);
        setIsFriend(friends);

        // Check for pending requests
        const requests = await getPendingRequests(user.$id);
        const pendingRequest = requests.find(req => 
          (req.fromUserId === selectedUser.$id || req.toUserId === selectedUser.$id)
        );

        if (pendingRequest) {
          setHasPendingRequest(true);
          setIsRequestFromThem(pendingRequest.fromUserId === selectedUser.$id);
        } else {
          setHasPendingRequest(false);
          setIsRequestFromThem(false);
        }
      } catch (error) {
        toast.error('Error checking friend status');
      }
    };

    checkStatus();
  }, [selectedUser, user, messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendRequest = async () => {
    try {
      await sendFriendRequest(selectedUser.$id);
      toast.success('Friend request sent!');
      setHasPendingRequest(true);
    } catch (error) {
      toast.error('Failed to send friend request');
    }
  };

  const handleAcceptRequest = async () => {
    try {
      const requests = await getPendingRequests(user.$id);
      const request = requests.find(req => req.fromUserId === selectedUser.$id);
      
      if (request) {
        await acceptFriendRequest(request.$id, selectedUser.$id, user.$id);
        toast.success('Friend request accepted!');
        setIsFriend(true);
        setHasPendingRequest(false);
      }
    } catch (error) {
      toast.error('Failed to accept friend request');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!messageInput.trim() && !selectedFile) || !selectedUser || !isFriend) return;

    try {
      let fileId = null;
      if (selectedFile) {
        setIsUploading(true);
        try {
          const uploadResult = await fileService.uploadFile(selectedFile);
          fileId = uploadResult.$id;
        } catch (error) {
          toast.error('Failed to upload file.');
          setIsUploading(false);
          return;
        }
      }

      const content = messageInput.trim() || (selectedFile ? 'Sent a file' : '');
      await sendMessage(user.$id, selectedUser.$id, content, fileId);

      setMessageInput('');
      setSelectedFile(null);
      setIsUploading(false);
    } catch (error) {
      toast.error('Failed to send message.');
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }
    setSelectedFile(file);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImageFile = (file) => {
    return file && file.type.startsWith('image/');
  };

  if (!selectedUser) {
    return (
      <div className="h-full flex items-center justify-center bg-dark-400">
        <div className="text-center p-8">
          <div className="w-20 h-20 rounded-full bg-dark-300 flex items-center justify-center mx-auto mb-4">
            <FiSend className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Select a user to chat</h3>
          <p className="text-gray-400">Choose a user from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  const renderStatusMessage = () => {
    if (isFriend) return null;

    if (hasPendingRequest) {
      if (isRequestFromThem) {
        return (
          <div className="text-center text-gray-400">
            <p>{selectedUser.firstName} wants to be friends!</p>
            <button
              onClick={handleAcceptRequest}
              className="mt-2 px-4 py-1 bg-primary-500 text-white rounded hover:bg-primary-600"
            >
              Accept Request
            </button>
          </div>
        );
      } else {
        return <p className="text-center text-gray-400">Friend request sent. Waiting for approval.</p>;
      }
    }

    return (
      <div className="text-center text-gray-400">
        <p>You need to be friends to chat with {selectedUser.firstName}.</p>
        <button
          onClick={handleSendRequest}
          className="mt-2 px-4 py-1 bg-primary-500 text-white rounded hover:bg-primary-600"
          disabled={hasPendingRequest}
        >
          {hasPendingRequest ? 'Request Pending' : 'Send Friend Request'}
        </button>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-dark-400">
      {/* Chat Header */}
      <div className="p-4 border-b border-dark-300 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary-500 to-primary-500 flex items-center justify-center">
            <span className="text-white font-bold">
              {selectedUser.firstName?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {selectedUser.firstName} {selectedUser.lastName}
            </h3>
            <p className="text-gray-400 text-sm">@{selectedUser.username}</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="px-3 py-1 rounded-full bg-dark-300">
            <span className="text-xs text-primary-400">🔒 Encrypted</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {isFriend ? (
          messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-dark-300 flex items-center justify-center mx-auto mb-4">
                  <FiSend className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No messages yet</h3>
                <p className="text-gray-400 text-sm">Start the conversation by sending a message</p>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const decryptedMessage = getDecryptedMessage(message);
              const isCurrentUser = message.fromUserId === user.$id;
              return (
                <MessageBubble
                  key={message.$id}
                  message={decryptedMessage}
                  isCurrentUser={isCurrentUser}
                />
              );
            })
          )
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="p-4">{renderStatusMessage()}</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* File preview */}
      {selectedFile && (
        <div className="px-4 py-2 bg-dark-300 border-t border-dark-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isImageFile(selectedFile) ? (
                <FiImage className="w-5 h-5 text-primary-400" />
              ) : (
                <FiFile className="w-5 h-5 text-primary-400" />
              )}
              <span className="text-white text-sm truncate">{selectedFile.name}</span>
              <span className="text-gray-400 text-xs">
                {Math.round(selectedFile.size / 1024)} KB
              </span>
            </div>
            <button onClick={clearSelectedFile} className="p-1 text-gray-400 hover:text-white">
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Input - Only show if friends */}
      {isFriend && (
        <div className="p-4 border-t border-dark-300">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <label htmlFor="file-input" className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-dark-300 transition-colors cursor-pointer">
              <FiPaperclip className="w-5 h-5" />
              <input
                id="file-input"
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-dark-500 text-white rounded-full placeholder-gray-400 focus:outline-none"
            />
            <button 
              type="submit" 
              disabled={isUploading} 
              className="px-4 py-2 text-white bg-primary-500 rounded-full hover:bg-primary-600 disabled:opacity-50"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ChatArea;