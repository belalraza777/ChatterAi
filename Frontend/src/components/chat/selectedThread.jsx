import { useRef, useEffect } from 'react'
import './chat.css'
import Markdown from 'react-markdown'; 
import { HiOutlineChatBubbleLeftRight, HiOutlineFolderOpen } from 'react-icons/hi2';


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
      if (Number.isNaN(date.getTime())) {
        return '';
      }

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
      <h2>
        <HiOutlineFolderOpen className="empty-state-icon" aria-hidden="true" />
        No thread selected
      </h2>
      <p>Select a conversation from the sidebar or start a new one.</p>
    </div>
  );
}

  return (
    <div className="thread-messages">
      <div className="messages-list" ref={chatRef}>
        {thread.messages?.map((msg, index) => (
          <div
            key={msg._id || `${msg.role}-${msg.timestamp || index}`}
            className={`message-row ${msg.role}`}
          >
            <div className={`message-avatar ${msg.role}`} aria-hidden="true">
              {msg.role === 'user' ? 'Y' : 'AI'}
            </div>

            <div className={`message ${msg.role}`}>
              {/* Markdown can render <p>, so use a div wrapper for consistent spacing. */}
              <div className="message-content">
                <Markdown>{msg.content}</Markdown>
              </div>

              <div className="message-footer">
                <span className='message-time'>{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}

        {!(thread.messages?.length) && (
          <div className="empty-chat">
            <h2>
              <HiOutlineChatBubbleLeftRight className="empty-state-icon" aria-hidden="true" />
              Start your first conversation
            </h2>
            <p>Type a message to begin chatting...</p>
          </div>
        )}
      </div>
    </div>
  );
}