import { useChat } from '../../context/useChatContext.jsx';
import './chat.css';
// ...existing code...
import SelectedThread from './selectedThread.jsx';
import MessageBox from './messageBox.jsx';
import Sidebar from './sideBar.jsx';
import Loader from './loader.jsx';
import { HiOutlineFolderOpen } from 'react-icons/hi2';


export default function Chat() {
    const {
        threadList,
        user,
        selectedThread,
        setSelectedThread,
        loadThreads,
        isLoading,
        handleSendMessage,
        selectedModel,
        setSelectedModel,
        modelOptions,
    } = useChat();

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
                        {/* Composer now includes model selection and optional image upload. */}
                        <MessageBox
                            onSend={handleSendMessage}
                            selectedModel={selectedModel}
                            onModelChange={setSelectedModel}
                            modelOptions={modelOptions}
                        />
                    </>
                ) : (
                    <div className="empty-thread">
                        <h2>
                            <HiOutlineFolderOpen className="empty-state-icon" aria-hidden="true" />
                            No thread selected
                        </h2>
                        <p>Select a conversation from the sidebar or start a new one.</p>
                    </div>
                )}
            </div>
        </div>
    );
}