import CryptoJS from 'crypto-js';

// Generate a random key for encryption
export const generateEncryptionKey = () => {
  return CryptoJS.lib.WordArray.random(256 / 8).toString();
};

// Encrypt a message with a given key
export const encryptMessage = (message, key) => {
  return CryptoJS.AES.encrypt(message, key).toString();
};

// Decrypt a message with a given key
export const decryptMessage = (encryptedMessage, key) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return 'Unable to decrypt message';
  }
};

// Encrypt the shared key with recipient's public key (simplified for demo)
// In a real implementation, this would use RSA or other asymmetric encryption
export const encryptKey = (key, recipientId) => {
  // For demo, we're using a derived key based on both user IDs
  // This is NOT secure for production - would use proper asymmetric encryption
  const encryptionPass = `secure_pass_${recipientId}`;
  return CryptoJS.AES.encrypt(key, encryptionPass).toString();
};

// Decrypt the shared key with user's private key (simplified for demo)
export const decryptKey = (encryptedKey, userId) => {
  try {
    // For demo, we're using a derived key based on both user IDs
    // This is NOT secure for production - would use proper asymmetric encryption
    const encryptionPass = `secure_pass_${userId}`;
    const bytes = CryptoJS.AES.decrypt(encryptedKey, encryptionPass);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Key decryption error:', error);
    return null;
  }
};

// Create a shared key for a conversation between two users
export const deriveSharedKey = (userId1, userId2) => {
  // Sort user IDs to ensure the same key regardless of order
  const sortedIds = [userId1, userId2].sort().join('_');
  // This is a simplified implementation and NOT secure for production
  // In production, use proper key exchange methods like Diffie-Hellman
  return CryptoJS.SHA256(sortedIds).toString();
};