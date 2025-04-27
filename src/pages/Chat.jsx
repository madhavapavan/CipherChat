import Sidebar from '../components/Chat/Sidebar';
import ChatArea from '../components/Chat/ChatArea';
import { ChatProvider } from '../contexts/ChatContext';

function Chat() {
  return (
    <div className="min-h-screen w-full bg-dark-500 flex items-center justify-center p-2">
      <div className="w-[95vw] max-w-[90vw] h-[96vh] max-h-[96vh] min-h-[720px] bg-dark-400 rounded-xl shadow-2xl overflow-hidden border border-dark-300">
        <ChatProvider>
          <div className="h-full w-full flex flex-col md:flex-row">
            <Sidebar />
            <div className="flex-grow h-full overflow-auto">
              <ChatArea />
            </div>
          </div>
        </ChatProvider>
      </div>
    </div>
  );
}

export default Chat;