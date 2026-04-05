import { useState } from "react";
import './chat.css';

export default function MessageBox({ onSend }) {
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  }

  return (
    <form className="message-box" onSubmit={handleSubmit}>
      <div className="message-box-container">
      <input
        type="text"
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">
       <i class="fa-solid fa-paper-plane"></i>
      </button>
      </div>
      {/* Safety note below input, similar to ChatGPT footer messaging. */}
      <p className="message-box-note">Chatter AI may generate inaccurate or incomplete responses. Please verify important information.</p>
    </form>
  );
}