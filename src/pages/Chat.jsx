import Sidebar from '../components/Chat/Sidebar';
import ChatArea from '../components/Chat/ChatArea';
import { ChatProvider } from '../contexts/ChatContext';

function Chat() {
  return (
    <ChatProvider>
      <div className="h-screen w-full bg-dark-500 flex flex-col md:flex-row overflow-hidden">
        <Sidebar />
        <div className="flex-grow h-full">
          <ChatArea />
        </div>
      </div>
    </ChatProvider>
  );
}

export default Chat;