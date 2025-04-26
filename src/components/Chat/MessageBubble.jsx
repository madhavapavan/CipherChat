import { useState } from 'react';
import { fileService } from '../../services/appwrite';
import { FiDownload, FiFile, FiImage } from 'react-icons/fi';

function MessageBubble({ message, isCurrentUser }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  const getFormattedTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleDownload = async (fileId) => {
    try {
      const downloadUrl = await fileService.downloadFile(fileId);
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
    }
  };
  
  const isImageFile = (fileId) => {
    // For this demo we're simplifying by assuming all files with IDs are images
    // In a real app, you'd store the file type or check the file extension
    return true;
  };
  
  return (
    <div 
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-xs sm:max-w-md space-y-1 ${
          isCurrentUser 
            ? 'bg-gradient-to-r from-secondary-600 to-primary-700 text-white' 
            : 'bg-dark-300 text-white'
        } rounded-2xl px-4 py-3`}
      >
        {message.fileId && isImageFile(message.fileId) ? (
          <div className="space-y-2">
            <div className="relative">
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark-400 rounded-lg">
                  <FiImage className="w-8 h-8 text-gray-500 animate-pulse-slow" />
                </div>
              )}
              <img
                src={fileService.getFilePreview(message.fileId)}
                alt="Shared image"
                className="rounded-lg max-h-60 object-contain w-full"
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-70">Image</span>
              <button
                onClick={() => handleDownload(message.fileId)}
                className="p-1 hover:bg-dark-200 rounded-full transition-colors"
              >
                <FiDownload className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : message.fileId ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiFile className="w-5 h-5" />
              <span>File attachment</span>
            </div>
            <button
              onClick={() => handleDownload(message.fileId)}
              className="p-1 hover:bg-dark-200 rounded-full transition-colors"
            >
              <FiDownload className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <p>{message.decryptedContent}</p>
        )}
        
        <div className="flex justify-end">
          <span className="text-xs opacity-70">
            {getFormattedTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;