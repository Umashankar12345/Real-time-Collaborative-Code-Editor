import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';

const ChatPanel = ({ socket, roomId, username }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (msg) => {
      setMessages(prev => [...prev, msg]);
    };

    socket.on('chat:message', handleMessage);

    return () => {
      socket.off('chat:message', handleMessage);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    
    // Optimistic append
    const msg = {
      id: Date.now().toString() + Math.random(),
      username,
      color: 'var(--accent-color)', // Highlight local user with accent
      text: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, { ...msg, isMe: true }]);
    socket.emit('chat:message', { roomId, text: input });
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-[#252526] w-full text-[#cccccc]">
      <div className="px-3 py-2 flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-semibold tracking-wide text-[#cccccc] uppercase">
          TEAM CHAT
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {messages.map(msg => {
          const timeString = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return (
            <div key={msg.id} className="flex flex-col animate-fade-in">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span 
                  className="text-[12px] font-semibold"
                  style={{ color: msg.isMe ? '#cccccc' : (msg.color || '#007acc') }}
                >
                  {msg.isMe ? 'You' : msg.username}
                </span>
                <span className="text-[10px] text-[#858585]">{timeString}</span>
              </div>
              <div className="text-[13px] leading-relaxed text-[#cccccc] break-words">
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={sendMessage}
        className="p-3 border-t border-[#3b3b3b] flex gap-2 shrink-0 bg-[#252526]"
      >
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Message..."
          className="flex-1 bg-[#3c3c3c] border border-transparent focus:border-[#007acc] text-[#cccccc] px-2 py-1.5 outline-none text-[13px] transition-colors placeholder-[#858585]"
        />
        <button 
          type="submit"
          disabled={!input.trim()}
          className={`px-3 py-1.5 flex items-center justify-center transition-colors ${
            input.trim() 
              ? 'bg-[#007acc] text-white hover:bg-[#005f9e] cursor-pointer' 
              : 'bg-[#3c3c3c] text-[#858585] cursor-not-allowed'
          }`}
          title="Send"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
