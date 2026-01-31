import { useChat } from '../../context/useChatContext.jsx';
import './chat.css';
// ...existing code...
import SelectedThread from './selectedThread.jsx';
import MessageBox from './messageBox.jsx';
import Sidebar from './sideBar.jsx';
import Loader from './loader.jsx';
import { use } from 'react';
import { useEffect } from 'react';


export default function Chat() {
    const {
        threadList,
        user,
        selectedThread,
        setSelectedThread,
        loadThreads,
        isLoading,
        handleSendMessage
    } = useChat();

    useEffect(() => { 
        loadThreads();  
    }, []);

    return (
        <div className="chat-app">
            <Sidebar
                user={user}
                threadList={threadList}
                selectedThread={selectedThread}
                setSelectedThread={setSelectedThread}
                loadThreads={loadThreads}
            />
            <div className="chat-area">
                {selectedThread ? (
                    <>
                        <SelectedThread thread={selectedThread} />
                        {isLoading && <Loader />}
                        <MessageBox onSend={handleSendMessage} />
                    </>
                ) : (
                    <div className="empty-thread">
                        <h2>📂 No thread selected</h2>
                        <p>Select a conversation from the sidebar or start a new one.</p>
                    </div>
                )}
            </div>
        </div>
    );
}