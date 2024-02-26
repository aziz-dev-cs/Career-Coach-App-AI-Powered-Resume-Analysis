import { useState, useRef, useEffect } from 'react';

interface WebRTCConfig {
  onStreamReady?: (stream: MediaStream) => void;
  onStreamEnd?: () => void;
  onError?: (error: Error) => void;
}

export function useWebRTC(config: WebRTCConfig = {}) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });
      
      setLocalStream(stream);
      setIsStreaming(true);
      
      if (config.onStreamReady) {
        config.onStreamReady(stream);
      }
      
      return stream;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to access microphone';
      setError(errorMsg);
      if (config.onStreamError) {
        config.onStreamError(new Error(errorMsg));
      }
      throw err;
    }
  };

  const stopStream = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      setIsStreaming(false);
      
      if (config.onStreamEnd) {
        config.onStreamEnd();
      }
    }
    
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  };

  const createPeerConnection = (signalServerUrl: string) => {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
    
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionRef.current = peerConnection;
    
    return peerConnection;
  };

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  return {
    localStream,
    isStreaming,
    error,
    startStream,
    stopStream,
    createPeerConnection
  };
}

// Add onStreamError to the config type
declare module './useWebRTC' {
  interface WebRTCConfig {
    onStreamError?: (error: Error) => void;
  }
}