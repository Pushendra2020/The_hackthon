
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Navbar from './just/Navbar';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // const btnSend = async () => {
  //   if (inputValue.trim() === '') return;

  //   const userMessage = { sender: 'user', text: inputValue };
  //   setMessages([...messages, userMessage]);
  //   setInputValue('');
  //   setLoading(true);
  //   try {
  //     const response = await axios.post('http://localhost:5500/chat', {
  //       inputValue: userMessage.text,
  //     });

  //     const botMessage = { sender: 'bot', text: response.data.output || 'No response received.' };
  //     setMessages([...messages, userMessage, botMessage]);
  //   } catch (error) {
  //     console.error('Error:', error);
  //     const errorMessage = { sender: 'bot', text: 'Error communicating with server.' };
  //     setMessages([...messages, userMessage, errorMessage]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



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
  
      // Format the bot's response to support bold text
      // const formatResponse = (text) => {
      //   return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // };
  
      const formatResponse = (text) => {
        // Bold formatting: **text**
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      
        // New points: Start new lines for each point starting with a number or bullet (e.g., "1." or "-")
        formattedText = formattedText.replace(/(\d+\.\s|- )/g, "<br/>$1");
      
        // Highlight calculations (numbers in parentheses, e.g., "(2857.14)")
        formattedText = formattedText.replace(/\((\d+(\.\d+)?)\)/g, "<span class='calculation'>$1</span> <br/>");
        return formattedText;
      };

      const botMessage = {
        sender: 'bot',
        text: formatResponse(response.data.output || 'No response received.'),
      };
  
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { sender: 'bot', text: 'Error communicating with server.' };
      setMessages([...messages, userMessage, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="chat-container">
        <div className="chat-box">
          {messages.map((message, index) => (
            <div className={`chat-message ${message.sender}`} key={index}>
            {message.sender === 'bot' ? (
              <p dangerouslySetInnerHTML={{ __html: message.text }}></p>
            ) : (
              <p>{message.text}</p>
            )}
          </div>
          ))}
          {loading && (
            <div className="chat-message bot">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>

{/* <div className={`chat-message ${messages.sender}`} key={index}>
  {messages.sender === 'bot' ? (
    <p dangerouslySetInnerHTML={{ __html: messages.text }}></p>
  ) : (
    <p>{messages.text}</p>
  )}
</div> */}


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
    </>

  );
};

export default App;