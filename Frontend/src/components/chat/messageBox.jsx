import { useRef, useState } from "react";
import './chat.css';
import { HiOutlineCpuChip, HiOutlinePaperAirplane, HiOutlinePhoto, HiXMark } from "react-icons/hi2";
import {
  CHAT_IMAGE_MAX_BYTES,
  CHAT_IMAGE_MAX_MB,
  DEFAULT_IMAGE_MODEL,
} from "../../constants/chatModels";

export default function MessageBox({ onSend, selectedModel, onModelChange, modelOptions }) {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef(null); // Ref to reset file input value when clearing selected image.
  const textareaRef = useRef(null);

  // Keep input height compact while allowing multi-line typing.
  const autoResizeTextarea = (element) => {
    if (!element) {
      return;
    }
    element.style.height = "0px";
    element.style.height = `${Math.min(element.scrollHeight, 150)}px`;
  };

  // Clears the selected image and resets any related error messages.
  const clearSelectedImage = () => {
    setSelectedImage(null);
    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validates the selected image file and updates state accordingly.
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > CHAT_IMAGE_MAX_BYTES) {
      setImageError(`Image must be ${CHAT_IMAGE_MAX_MB} MB or less.`);
      clearSelectedImage();
      return;
    }
    // Auto-pick an image-capable model when user attaches a photo.
    onModelChange(DEFAULT_IMAGE_MODEL);
    setImageError("");
    setSelectedImage(file);
  };

  // Handles form submission, sending the message and attached image if present.
  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim() && !selectedImage) {
      return;
    }
    await onSend({ messageInput: message, imageFile: selectedImage });
    setMessage("");
    clearSelectedImage();
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      textareaRef.current.style.height = "52px";
    }
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    autoResizeTextarea(e.target);
  };

  // Send on Enter and keep Shift+Enter for new lines.
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!message.trim() && !selectedImage) {
        return;
      }
      handleSubmit(e);
    }
  }

  return (
    <form className="message-box" onSubmit={handleSubmit}>
      <div className="composer-shell">
        <div className="message-box-container">
          <textarea
            ref={textareaRef}
            className="message-box-input"
            placeholder="Type your message..."
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleInputKeyDown}
            rows={1}
          />

          <button
            type="submit"
            className="message-box-send"
            disabled={!message.trim() && !selectedImage}
            aria-label="Send message"
          >
            <HiOutlinePaperAirplane />
          </button>
        </div>

        <div className="message-box-tools">
          <div className="composer-actions-group">
            <label className="composer-tool image-upload-label">
              <HiOutlinePhoto className="tool-label-icon" aria-hidden="true" />
              <span>Photo</span>
              <input
                className="message-box-file-input"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            <div className="composer-tool model-select-item">
              <span className="message-box-tool-label">
                <HiOutlineCpuChip className="tool-label-icon" aria-hidden="true" />
                Model
              </span>
              <div className="model-select-wrap">
                <select
                  className="message-box-select"
                  value={selectedModel}
                  onChange={(e) => onModelChange(e.target.value)}
                >
                  {modelOptions.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedImage && (
              <div className="message-box-selected-file" title={selectedImage.name}>
                <span>{selectedImage.name}</span>
                <button
                  type="button"
                  className="message-box-clear-image"
                  onClick={clearSelectedImage}
                  aria-label="Remove selected image"
                >
                  <HiXMark />
                </button>
              </div>
            )}
          </div>

          <span className="message-box-hint">Enter to send • Shift+Enter new line</span>
        </div>

        {imageError && (
          <p className="message-box-error">{imageError}</p>
        )}
      </div>
    </form>
  );
}