import { useState, useRef, useEffect } from 'react';

// Hook for Web Speech API speech-to-text transcription
export const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Browser compatibility: Chrome uses webkitSpeechRecognition, Firefox uses SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      // Collect interim (in-progress) and final (confirmed) transcripts from results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptSegment + ' ';
        } else {
          interimTranscript += transcriptSegment;
        }
      }

      // Show final transcript if available, otherwise show interim as user speaks
      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event) => {
      // Provide user-friendly error messages based on error type
      let errorMsg = 'Microphone error';
      if (event.error === 'no-speech') {
        errorMsg = 'No speech detected. Please try again.';
      } else if (event.error === 'network') {
        errorMsg = 'Network error. Check your connection.';
      } else if (event.error === 'not-allowed') {
        errorMsg = 'Microphone permission denied.';
      }
      setError(errorMsg);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const start = async () => {
    if (!recognitionRef.current) return;
    setError('');
    setTranscript('');
    setIsProcessing(true);
    recognitionRef.current.start();
  };

  const stop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setIsProcessing(false);
  };

  const reset = () => {
    setTranscript('');
    setError('');
    setIsListening(false);
    setIsProcessing(false);
  };

  return {
    isListening,
    transcript,
    error,
    isProcessing,
    start,
    stop,
    reset,
  };
};
