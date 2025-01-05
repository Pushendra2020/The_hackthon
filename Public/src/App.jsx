

import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const btnSend = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5500/chat', {
        inputValue: userMessage.text,
      });

      const botMessage = { sender: 'bot', text: response.data.output || 'No response received.' };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { sender: 'bot', text: 'Error communicating with server.' };
      setMessages([...messages, userMessage, errorMessage]);
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender}`}>
            <p>{message.text}</p>
          </div>
        ))}
         {loading && (
          <div className="chat-message bot">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Chat with AI"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="chat-input"
        />
        <button onClick={btnSend} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};

export default App;