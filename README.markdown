# CipherChat

CipherChat is a secure, real-time messaging application with end-to-end encryption, built using React, Tailwind CSS, and Appwrite. It allows users to register, create profiles, send friend requests, and chat securely with friends in a sleek, dark-themed interface. The app features real-time notifications for messages and friend requests, powered by Appwrite's WebSocket subscriptions.

**Live Demo**: [https://cipherchat-io.netlify.app](https://cipherchat-io.netlify.app)

## Features

- **Secure Messaging**: End-to-end encrypted messages using custom encryption utilities.
- **User Profiles**: Create and update profiles with first name, last name, and username.
- **Friend System**: Send, accept, and decline friend requests.
- **Real-Time Notifications**: Instant updates for new messages and friend requests via Appwrite WebSockets.
- **Responsive Design**: Mobile-friendly layout with a sidebar for user navigation and chat area for conversations.
- **Dark Theme**: Modern, dark-themed UI styled with Tailwind CSS.
- **Authentication**: Secure login and registration powered by Appwrite's authentication service.

## Project Structure

```
project/
├── index.html              # Entry HTML file
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Dependency lock file
├── postcss.config.js       # PostCSS configuration for Tailwind CSS
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.js          # Vite configuration for fast builds
├── eslint.config.js        # ESLint configuration for code linting
├── src/
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # Entry point for React rendering
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── LoginForm.jsx    # Login form component
│   │   │   ├── ProfileForm.jsx  # Profile creation form component
│   │   │   └── RegisterForm.jsx # Registration form component
│   │   └── Chat/
│   │       ├── ChatArea.jsx        # Chat interface for messaging
│   │       ├── MessageBubble.jsx   # Individual message display component
│   │       ├── NotificationPanel.jsx # Panel for messages and friend requests
│   │       ├── Sidebar.jsx         # Sidebar for user list and settings
│   │       └── UserList.jsx        # List of users for chat selection
│   ├── contexts/
│   │   ├── AuthContext.jsx  # Context for authentication state
│   │   └── ChatContext.jsx  # Context for chat state and real-time updates
│   ├── pages/
│   │   ├── Auth.jsx    # Authentication page (login/register)
│   │   ├── Chat.jsx    # Main chat page with sidebar and chat area
│   │   └── Profile.jsx # Profile setup page for new users
│   ├── services/
│   │   └── appwrite.js # Appwrite service for auth, database, and storage
│   └── utils/
│       └── encryption.js # Utilities for end-to-end encryption
```

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Appwrite**: A running Appwrite instance (cloud or self-hosted)
- **Git**: For cloning the repository

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/cipherchat.git
   cd cipherchat
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Appwrite**:
   - Set up an Appwrite instance (e.g., via [Appwrite Cloud](https://appwrite.io) or self-hosted).
   - Create a project in Appwrite and note the **Project ID** and **Endpoint**.
   - Update `src/services/appwrite.js` with your Appwrite configuration:
     ```javascript
     const client = new Client();
     client
       .setEndpoint('YOUR_APPWRITE_ENDPOINT') // e.g., https://fra.cloud.appwrite.io/v1
       .setProject('YOUR_PROJECT_ID'); // e.g., 680a6b1a000b40a967fc
     ```
   - Ensure the following collections are set up in Appwrite:
     - **Users**
     - **Messages**
     - **Requests**
     - **Files**
     - **Database ID**
   

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   - Open `http://localhost:5173` (or the port specified by Vite) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```
   - Deploy the `dist/` folder to a hosting service like Netlify.

6. **Deploy to Netlify**:
   - Connect your repository to Netlify.
   - Set the build command to `npm run build` and publish directory to `dist`.
   - Deploy the site (current live URL: [https://cipherchat-io.netlify.app](https://cipherchat-io.netlify.app)).

## Technologies Used

- **React**: Frontend framework for building the UI.
- **Vite**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Appwrite**: Backend-as-a-Service for authentication, database, storage, and real-time subscriptions.
- **React Router**: Client-side routing for navigation.
- **React Hot Toast**: Notification system for user feedback.
- **React Icons**: Icon library for UI elements.
- **ESLint**: Code linting for consistent code quality.
- **PostCSS**: CSS processing for Tailwind integration.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please ensure your code follows the ESLint rules and includes relevant tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, please contact the project maintainers at [your-email@example.com](mailto:your-email@example.com) or open an issue on the GitHub repository.

---

**CipherChat**: Securely connect with friends in real-time. Powered by Appwrite.