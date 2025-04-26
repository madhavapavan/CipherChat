import ProfileForm from '../components/Auth/ProfileForm';
import { FiUserPlus } from 'react-icons/fi';

function Profile() {
  return (
    <div className="min-h-screen w-full bg-dark-500 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 mb-4 bg-dark-400 rounded-full">
          <FiUserPlus className="h-8 w-8 text-primary-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Welcome</h1>
        <p className="text-gray-400">Let's set up your profile</p>
      </div>
      
      <ProfileForm />
      
      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>End-to-end encrypted chat powered by Appwrite</p>
      </div>
    </div>
  );
}

export default Profile;