import VideoPlayer from "./VideoPlayer";

function RemoteVideo({ videoRef, stream, userName }) {
  return (
    <VideoPlayer
      videoRef={videoRef}
      stream={stream}
      label={userName ? `Remote — ${userName}` : "Remote"}
      className="h-80"
    />
  );
}

export default RemoteVideo;
