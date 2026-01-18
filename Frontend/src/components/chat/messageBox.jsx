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
    </form>
  );
}