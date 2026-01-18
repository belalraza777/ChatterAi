import { useRef, useEffect } from 'react'
import './chat.css'

export default function SelectedThread({ thread }) {
  //auto scroll to end 
  const chatRef = useRef(null);
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [thread]);

  // Format timestamp (handles both ISO strings and milliseconds)
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const formattedDate = date.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',   // Jan, Feb, ...
        day: '2-digit'
      });
      const formattedTime = date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      return `${formattedDate} , ${formattedTime}`;
    } catch {
      return '';
    }
  };


  if (thread == null) {
  return (
    <div className="empty-thread">
      <h2>📂 No thread selected</h2>
      <p>Select a conversation from the sidebar or start a new one.</p>
    </div>
  );
}

  return (
    <div className="thread-messages">
      <div className="messages-list" ref={chatRef}>
        {thread.messages?.map((msg) => (
          <div key={msg._id || msg.timestamp} className={`message ${msg.role}`}>
            <p>
              <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
            </p>
            <div className='message-time'>{formatTime(msg.timestamp)}</div>
          </div>
        ))}

        {!(thread.messages?.length) && (
          <div className="empty-chat">
            <h2>💬 Start your first conversation</h2>
            <p>Type a message to begin chatting...</p>
          </div>
        )}
      </div>
    </div>
  );
}