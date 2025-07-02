import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
  // Sample chat data
  const availableChats = [
    { id: 'bot', name: 'PlantBot', avatar: '🌱', lastMessage: 'How can I help with your plants?' },
    { id: 'support', name: 'Support Team', avatar: '🛠️', lastMessage: 'We can help with technical issues' },
    { id: 'community', name: 'Plant Community', avatar: '👥', lastMessage: 'Join our plant lovers group!' },
    { id: 'sales', name: 'Sales', avatar: '💰', lastMessage: 'Special offers this week' }
  ];

  const [activeChat, setActiveChat] = useState(availableChats[0].id);
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to the chat! How can I help you today?", sender: 'bot' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const currentUser = {
    id: 'user1',
    name: 'You',
    avatar: '👤'
  };

  const getChatUser = (chatId) => {
    return availableChats.find(chat => chat.id === chatId) || 
           { id: chatId, name: 'Unknown', avatar: '❓' };
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: currentUser.id
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(newMessage),
        sender: activeChat
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello there! How can I assist you today?";
    } else if (message.includes('help')) {
      return "I can help with plant care tips and troubleshooting.";
    } else {
      return "Thanks for your message! How can I help you further?";
    }
  };

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId);
    // Reset messages when changing chat
    setMessages([
      { 
        id: 1, 
        text: `You're now chatting with ${getChatUser(chatId).name}. How can I help?`, 
        sender: chatId 
      }
    ]);
  };

  return (
    <div className="chat-app-container">
      {/* Sidebar with available chats */}
      <div className="chats-sidebar">
        <h2 className="sidebar-title">Chats</h2>
        <div className="chat-list">
          {availableChats.map(chat => (
            <div 
              key={chat.id}
              className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
              onClick={() => handleChatSelect(chat.id)}
            >
              <div className="chat-avatar">{chat.avatar}</div>
              <div className="chat-info">
                <h3>{chat.name}</h3>
                <p className="chat-preview">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="chat-main">
        <div className="chat-header">
          <div className="chat-partner-info">
            <span className="avatar">{getChatUser(activeChat).avatar}</span>
            <h2>{getChatUser(activeChat).name}</h2>
          </div>
        </div>

        <div className="messages-container">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender === currentUser.id ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                {message.sender !== currentUser.id && (
                  <span className="message-sender-avatar">
                    {getChatUser(message.sender).avatar}
                  </span>
                )}
                <div className="message-text">
                  {message.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="message-input-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;