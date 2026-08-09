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
      color: '#fff', // We can let local user be white or fetch their color
      text: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, { ...msg, isMe: true }]);
    socket.emit('chat:message', { roomId, text: input });
    setInput('');
  };

  return (
    <div style={{
      width: '300px',
      backgroundColor: 'var(--bg-secondary)',
      borderLeft: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <MessageSquare size={16} color="var(--text-secondary)" />
        <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--text-secondary)' }}>
          TEAM CHAT
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: msg.isMe ? 'var(--text-secondary)' : msg.color, marginBottom: '4px', fontWeight: 'bold' }}>
              {msg.isMe ? 'You' : msg.username}
            </span>
            <div style={{ 
              backgroundColor: msg.isMe ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              color: 'var(--text-primary)',
              wordBreak: 'break-word'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={sendMessage}
        style={{
          padding: '12px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          gap: '8px'
        }}
      >
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Message..."
          style={{
            flex: 1,
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-light)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            outline: 'none',
            fontSize: '13px'
          }}
        />
        <button 
          type="submit"
          disabled={!input.trim()}
          style={{
            backgroundColor: input.trim() ? 'var(--accent-color)' : 'var(--bg-tertiary)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
