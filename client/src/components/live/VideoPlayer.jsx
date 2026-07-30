function VideoPlayer({ videoRef, stream, muted = false, label, className = "" }) {
  return (
    <div className={`relative bg-black rounded-2xl overflow-hidden ${className}`}>
      {label && (
        <div className="absolute top-4 left-4 z-10 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
          {label}
        </div>
      )}
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className="w-full h-full object-cover min-h-[280px]"
        />
      ) : (
        <div className="w-full min-h-[280px] flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-3xl text-white">
            ?
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
