import { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

function ChatPanel({ messages, onSendMessage, onTyping, currentUserId }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    onTyping?.(true);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => onTyping?.(false), 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
    onTyping?.(false);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow flex flex-col h-full">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold">Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[240px] max-h-[320px]">
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center">No messages yet</p>
        )}

        {messages.map((msg, index) => {
          const isOwn = msg.userId === currentUserId;
          return (
            <div key={index} className={isOwn ? "text-right" : ""}>
              <p className="font-semibold text-sm text-gray-600">{msg.userName}</p>
              <div
                className={`inline-block rounded-xl p-3 mt-1 text-left max-w-[85%] ${
                  isOwn ? "bg-blue-100" : "bg-gray-100"
                }`}
              >
                {msg.message}
              </div>
              <p className="text-xs text-gray-400 mt-1">{formatTime(msg.timestamp)}</p>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type message..."
          className="flex-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black/20"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-black text-white px-4 rounded-xl hover:bg-gray-800 disabled:opacity-50"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}

export default ChatPanel;
