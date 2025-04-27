import { Client, Account, Databases, Storage, Query } from 'appwrite';

const client = new Client();
client
  .setEndpoint(import.meta.env.APPWRITE_ENDPOINT)
  .setProject(import.meta.env.APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = import.meta.env.DATABASE_ID;
export const USERS_COLLECTION_ID = import.meta.env.USERS_COLLECTION_ID;
export const MESSAGES_COLLECTION_ID = import.meta.env.MESSAGES_COLLECTION_ID;
export const REQUESTS_COLLECTION_ID = import.meta.env.REQUESTS_COLLECTION_ID;
export const FILES_COLLECTION_ID = import.meta.env.FILES_COLLECTION_ID;

export const authService = {
  async createAccount(email, password) {
    try {
      const response = await account.create('unique()', email, password);
      if (response) return this.login(email, password);
      return response;
    } catch (error) { throw error; }
  },
  async login(email, password) {
    try { return await account.createEmailSession(email, password); } 
    catch (error) { throw error; }
  },
  async getCurrentUser() {
    try { return await account.get(); } 
    catch (error) { console.error('Error getting current user:', error); return null; }
  },
  async logout() {
    try { return await account.deleteSession('current'); } 
    catch (error) { throw error; }
  }
};

export const userService = {
  async createProfile(userId, firstName, lastName, username) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        { firstName, lastName, username, friends: [], createdAt: new Date().toISOString() }
      );
    } catch (error) { throw error; }
  },
  async updateProfile(userId, data) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username
        }
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  async getProfile(userId) {
    try {
      return await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, userId);
    } catch (error) { console.error('Error getting user profile:', error); return null; }
  },
  async listUsers(currentUserId) {
    try {
      return (await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.notEqual('$id', currentUserId)]
      )).documents;
    } catch (error) { console.error('Error listing users:', error); return []; }
  },
  async addFriend(userId, friendId) {
    try {
      const user = await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, userId);
      if (user.friends && user.friends.includes(friendId)) return user;

      const updatedFriends = [...(user.friends || []), friendId];

      return await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        { friends: updatedFriends }
      );
    } catch (error) {
      console.error('Error in addFriend:', error);
      throw error;
    }
  },
  async removeFriend(userId, friendId) {
    try {
      const user = await this.getProfile(userId);
      const updatedFriends = (user.friends || []).filter(id => id !== friendId);
      return await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        { friends: updatedFriends }
      );
    } catch (error) { throw error; }
  },
  async areFriends(userId1, userId2) {
    try {
      const user1 = await this.getProfile(userId1);
      return (user1.friends || []).includes(userId2);
    } catch (error) { console.error('Error checking friend status:', error); return false; }
  },
  async getFriends(userId) {
    try {
      const user = await this.getProfile(userId);
      if (!user.friends?.length) return [];
      return (await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('$id', user.friends)]
      )).documents;
    } catch (error) { console.error('Error getting friends list:', error); return []; }
  }
};

export const requestService = {
  async sendRequest(fromUserId, toUserId) {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        'unique()',
        { fromUserId, toUserId, status: 'pending', createdAt: new Date().toISOString() }
      );
    } catch (error) { throw error; }
  },
  async getRequests(userId) {
    try {
      return (await databases.listDocuments(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        [Query.equal('toUserId', userId), Query.equal('status', 'pending')]
      )).documents;
    } catch (error) { console.error('Error getting requests:', error); return []; }
  },
  async getSentRequests(userId) {
    try {
      return (await databases.listDocuments(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        [Query.equal('fromUserId', userId), Query.equal('status', 'pending')]
      )).documents;
    } catch (error) { console.error('Error getting sent requests:', error); return []; }
  },
  async updateRequestStatus(requestId, status) {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        REQUESTS_COLLECTION_ID,
        requestId,
        { status }
      );
    } catch (error) { throw error; }
  },
  async acceptRequest(requestId) {
    try {
      const request = await databases.getDocument(DATABASE_ID, REQUESTS_COLLECTION_ID, requestId);
      if (!request || request.status !== 'pending') throw new Error('Invalid or already processed request');

      await Promise.all([
        userService.addFriend(request.fromUserId, request.toUserId),
        userService.addFriend(request.toUserId, request.fromUserId)
      ]);

      await this.updateRequestStatus(requestId, 'accepted');
      return true;
    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw error;
    }
  },
  async rejectRequest(requestId) {
    try {
      return await this.updateRequestStatus(requestId, 'rejected');
    } catch (error) { throw error; }
  }
};

export const messageService = {
  async sendMessage(fromUserId, toUserId, content, encryptedKey, fileId = null) {
    try {
      const areFriends = await userService.areFriends(fromUserId, toUserId);
      if (!areFriends) throw new Error('You can only message friends');

      return await databases.createDocument(
        DATABASE_ID,
        MESSAGES_COLLECTION_ID,
        'unique()',
        { fromUserId, toUserId, content, encryptedKey, fileId, createdAt: new Date().toISOString() }
      );
    } catch (error) { throw error; }
  },
  async getMessages(userId1, userId2) {
    try {
      const [messages1, messages2] = await Promise.all([ 
        databases.listDocuments(DATABASE_ID, MESSAGES_COLLECTION_ID, [
          Query.equal('fromUserId', userId1),
          Query.equal('toUserId', userId2)
        ]), 
        databases.listDocuments(DATABASE_ID, MESSAGES_COLLECTION_ID, [
          Query.equal('fromUserId', userId2),
          Query.equal('toUserId', userId1)
        ])
      ]);
      return [...messages1.documents, ...messages2.documents]
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } catch (error) { console.error('Error getting messages:', error); return []; }
  }
};

export const fileService = {
  async uploadFile(file) {
    if (file.size > 5 * 1024 * 1024) throw new Error('File size exceeds 5MB limit');
    try {
      return await storage.createFile(FILES_COLLECTION_ID, 'unique()', file);
    } catch (error) { throw error; }
  },
  getFilePreview(fileId) { return storage.getFilePreview(FILES_COLLECTION_ID, fileId); },
  async downloadFile(fileId) {
    try { return await storage.getFileDownload(FILES_COLLECTION_ID, fileId); } 
    catch (error) { throw error; }
  }
};

export const subscribeToMessages = (callback) => {
  let reconnectAttempts = 0;
  const maxAttempts = 5;

  const subscribe = () => {
    const subscription = client.subscribe(
      `databases.${DATABASE_ID}.collections.${MESSAGES_COLLECTION_ID}.documents`,
      (response) => {
        reconnectAttempts = 0; // Reset on successful message
        callback(response);
      },
      (error) => {
        console.error('WebSocket error:', error);
        if (reconnectAttempts < maxAttempts) {
          reconnectAttempts++;
          console.log(`Reconnecting WebSocket in ${reconnectAttempts} seconds...`);
          setTimeout(subscribe, reconnectAttempts * 1000);
        } else {
          console.error('Max WebSocket reconnection attempts reached');
        }
      }
    );
    return subscription;
  };

  const subscription = subscribe();
  return () => subscription();
};

export const subscribeToRequests = (callback) => {
  let reconnectAttempts = 0;
  const maxAttempts = 5;

  const subscribe = () => {
    const subscription = client.subscribe(
      `databases.${DATABASE_ID}.collections.${REQUESTS_COLLECTION_ID}.documents`,
      (response) => {
        reconnectAttempts = 0;
        callback(response);
      },
      (error) => {
        console.error('WebSocket error:', error);
        if (reconnectAttempts < maxAttempts) {
          reconnectAttempts++;
          console.log(`Reconnecting WebSocket in ${reconnectAttempts} seconds...`);
          setTimeout(subscribe, reconnectAttempts * 1000);
        } else {
          console.error('Max WebSocket reconnection attempts reached');
        }
      }
    );
    return subscription;
  };

  const subscription = subscribe();
  return () => subscription();
};

export const subscribeToUsers = (callback) => {
  let reconnectAttempts = 0;
  const maxAttempts = 5;

  const subscribe = () => {
    const subscription = client.subscribe(
      `databases.${DATABASE_ID}.collections.${USERS_COLLECTION_ID}.documents`,
      (response) => {
        reconnectAttempts = 0;
        callback(response);
      },
      (error) => {
        console.error('WebSocket error:', error);
        if (reconnectAttempts < maxAttempts) {
          reconnectAttempts++;
          console.log(`Reconnecting WebSocket in ${reconnectAttempts} seconds...`);
          setTimeout(subscribe, reconnectAttempts * 1000);
        } else {
          console.error('Max WebSocket reconnection attempts reached');
        }
      }
    );
    return subscription;
  };

  const subscription = subscribe();
  return () => subscription();
};

export const subscribeToFiles = (callback) => {
  let reconnectAttempts = 0;
  const maxAttempts = 5;

  const subscribe = () => {
    const subscription = client.subscribe(
      `databases.${DATABASE_ID}.collections.${FILES_COLLECTION_ID}.documents`,
      (response) => {
        reconnectAttempts = 0;
        callback(response);
      },
      (error) => {
        console.error('WebSocket error:', error);
        if (reconnectAttempts < maxAttempts) {
          reconnectAttempts++;
          console.log(`Reconnecting WebSocket in ${reconnectAttempts} seconds...`);
          setTimeout(subscribe, reconnectAttempts * 1000);
        } else {
          console.error('Max WebSocket reconnection attempts reached');
        }
      }
    );
    return subscription;
  };

  const subscription = subscribe();
  return () => subscription();
};
