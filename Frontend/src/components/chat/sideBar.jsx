import { useState } from 'react';
import Thread from './thread.jsx';
import NewThread from './newThread.jsx';
import UserInfo from './userInfo.jsx';
import { showThreadMessage } from "../../api/chatApi.js";

export default function Sidebar({ user, threadList, selectedThread, setSelectedThread, loadThreads }) {
    // State to control mobile sidebar visibility
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Handle selecting a thread
    async function handleThreadSelect(thread) {
        const res = await showThreadMessage(thread._id);
        setSelectedThread(res.data.data);

        // Close sidebar on mobile after selection
        setSidebarOpen(false);
    }

    return (
        <>
            {/* Mobile toggle button at top-right */}
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>

            {/* Overlay behind sidebar on mobile */}
            {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

            {/* Sidebar container */}
            <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                {/* User info */}
                <div className="user-info">
                    <h2>ChatterAI</h2>
                    <UserInfo user={user} loadThreads={loadThreads} />
                </div>

                <hr />

                {/* New thread */}
                <NewThread setSelectedThread={setSelectedThread} loadThreads={loadThreads} />

                <hr />

                {/* List of threads  */}
                <div className="threads">
                    {threadList.slice().reverse().map(thread => (  //in reversed order
                        <Thread
                            key={thread._id}
                            thread={thread}
                            onSelect={() => handleThreadSelect(thread)}
                            isSelected={selectedThread?._id === thread._id}
                            loadThreads={loadThreads}
                            setSelectedThread={setSelectedThread}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}
