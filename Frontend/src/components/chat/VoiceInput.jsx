import { useState, useEffect } from 'react';
import { HiOutlineMicrophone, HiOutlineXMark, HiOutlinePaperAirplane } from 'react-icons/hi2';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import './voiceInput.css';

// Voice input component with modal UI - records speech and sends transcribed text as message
export default function VoiceInput({ onSend, disabled = false }) {
  const { isListening, transcript, error, isProcessing, start, stop, reset } = useVoiceInput();
  const [isOpen, setIsOpen] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let timer;
    if (isListening) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isListening]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    setIsOpen(true);
    setRecordingTime(0);
    await start();
  };

  const handleStopAndSend = async () => {
    if (!transcript.trim()) return;
    
    stop();
    setIsSending(true);
    
    try {
      // Send transcribed text as regular message via parent handler
      await onSend({ messageInput: transcript });
      reset();
      setIsOpen(false);
      setRecordingTime(0);
    } catch (err) {
      console.error('Failed to send voice message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCancel = () => {
    stop();
    reset();
    setIsOpen(false);
    setRecordingTime(0);
    setIsSending(false);
  };

  // Show mic button when modal closed, show modal when recording
  if (!isOpen) {
    return (
      <button
        type="button"
        className="voice-tool-btn"
        onClick={handleStartRecording}
        disabled={disabled}
        aria-label="Send voice message"
        title="Voice message"
      >
        <HiOutlineMicrophone className="voice-tool-icon" />
        <span>Voice</span>
      </button>
    );
  }

  return (
    <>
      <div className="voice-modal-overlay" onClick={handleCancel} />
      <div className="voice-modal">
        <div className="voice-modal-header">
          <h3>Voice Message</h3>
          <button
            type="button"
            className="voice-modal-close"
            onClick={handleCancel}
            aria-label="Close"
            disabled={isSending}
          >
            <HiOutlineXMark />
          </button>
        </div>

        <div className="voice-modal-content">
          {error ? (
            <div className="voice-error">
              <p>{error}</p>
              <button
                type="button"
                className="voice-retry-btn"
                onClick={handleStartRecording}
                disabled={isSending}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className={`voice-recorder ${isListening ? 'recording' : ''}`}>
                <div className="voice-mic-icon">
                  <HiOutlineMicrophone />
                </div>
                {isListening && (
                  <>
                    <div className="voice-pulse" />
                    <div className="voice-time">{formatTime(recordingTime)}</div>
                  </>
                )}
              </div>

              {transcript && (
                <div className="voice-transcript">
                  <p>{transcript}</p>
                </div>
              )}

              {!isListening && !transcript && (
                <p className="voice-hint">Ready to record...</p>
              )}

              {isListening && (
                <p className="voice-status">Recording...</p>
              )}
            </>
          )}
        </div>

        <div className="voice-modal-actions">
          <button
            type="button"
            className="voice-action-btn cancel"
            onClick={handleCancel}
            disabled={isSending || isListening}
          >
            Cancel
          </button>
          {!error && (
            <button
              type="button"
              className="voice-action-btn send"
              onClick={handleStopAndSend}
              disabled={!transcript.trim() || isSending}
            >
              {isSending ? 'Sending...' : (
                <>
                  <HiOutlinePaperAirplane className="send-icon" />
                  Send
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
