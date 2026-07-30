import { useCallback, useEffect, useRef, useState } from "react";
import { connectSocket, SOCKET_EVENTS } from "../socket/socketClient";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export const useWebRTC = (roomId, userId, remoteUserId) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const pendingCandidatesRef = useRef([]);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const processPendingCandidates = useCallback(async (pc) => {
    while (pendingCandidatesRef.current.length > 0) {
      const candidate = pendingCandidatesRef.current.shift();
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding queued ICE candidate:", err);
      }
    }
  }, []);

  const createPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      return peerConnectionRef.current;
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const socket = connectSocket();
        socket.emit(SOCKET_EVENTS.ICE_CANDIDATE, {
          roomId,
          candidate: event.candidate,
          targetUserId: remoteUserId,
        });
      }
    };

    pc.ontrack = (event) => {
      const [stream] = event.streams;
      if (stream) {
        setRemoteStream(stream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("RTCPeerConnection state:", pc.connectionState);
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [roomId, remoteUserId]);

  const startLocalStream = useCallback(async () => {
    if (localStreamRef.current) {
      return localStreamRef.current;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error("Failed to get user media:", error);
      throw error;
    }
  }, []);

  const addLocalTracksToPeer = useCallback((pc, stream) => {
    if (!pc || !stream) return;
    const senders = pc.getSenders();
    stream.getTracks().forEach((track) => {
      const exists = senders.some((sender) => sender.track?.kind === track.kind);
      if (!exists) {
        pc.addTrack(track, stream);
      }
    });
  }, []);

  const createOffer = useCallback(async () => {
    try {
      const pc = peerConnectionRef.current || createPeerConnection();
      let stream = localStreamRef.current;

      if (!stream) {
        stream = await startLocalStream();
      }

      addLocalTracksToPeer(pc, stream);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const socket = connectSocket();
      socket.emit(SOCKET_EVENTS.OFFER, {
        roomId,
        offer,
        targetUserId: remoteUserId,
      });
    } catch (err) {
      console.error("Failed to create offer:", err);
    }
  }, [roomId, remoteUserId, createPeerConnection, startLocalStream, addLocalTracksToPeer]);

  const handleOffer = useCallback(
    async (offer, fromUserId) => {
      try {
        const pc = peerConnectionRef.current || createPeerConnection();
        let stream = localStreamRef.current;

        if (!stream) {
          stream = await startLocalStream();
        }

        addLocalTracksToPeer(pc, stream);

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        await processPendingCandidates(pc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        const socket = connectSocket();
        socket.emit(SOCKET_EVENTS.ANSWER, {
          roomId,
          answer,
          targetUserId: fromUserId,
        });
      } catch (err) {
        console.error("Failed to handle offer:", err);
      }
    },
    [roomId, createPeerConnection, startLocalStream, addLocalTracksToPeer, processPendingCandidates]
  );

  const handleAnswer = useCallback(
    async (answer) => {
      try {
        const pc = peerConnectionRef.current;
        if (pc && pc.signalingState !== "stable") {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          await processPendingCandidates(pc);
        }
      } catch (err) {
        console.error("Failed to handle answer:", err);
      }
    },
    [processPendingCandidates]
  );

  const handleIceCandidate = useCallback(async (candidate) => {
    const pc = peerConnectionRef.current;
    if (pc && pc.remoteDescription && pc.remoteDescription.type) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    } else {
      pendingCandidatesRef.current.push(candidate);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  }, [isVideoOff]);

  const stopScreenShare = useCallback(async () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    const pc = peerConnectionRef.current;
    const cameraTrack = localStreamRef.current?.getVideoTracks()[0];

    if (pc && cameraTrack) {
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (sender) {
        await sender.replaceTrack(cameraTrack);
      }
    }

    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }

    setIsScreenSharing(false);
  }, []);

  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      screenStreamRef.current = screenStream;
      const screenTrack = screenStream.getVideoTracks()[0];
      const pc = peerConnectionRef.current;

      if (pc) {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) {
          await sender.replaceTrack(screenTrack);
        }
      }

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = screenStream;
      }

      screenTrack.onended = () => stopScreenShare();
      setIsScreenSharing(true);
    } catch (error) {
      console.error("Screen share failed:", error);
    }
  }, [stopScreenShare]);

  const toggleScreenShare = useCallback(() => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  }, [isScreenSharing, startScreenShare, stopScreenShare]);

  const cleanup = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    pendingCandidatesRef.current = [];
    setLocalStream(null);
    setRemoteStream(null);
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    isScreenSharing,
    startLocalStream,
    createOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    cleanup,
  };
};

export default useWebRTC;

