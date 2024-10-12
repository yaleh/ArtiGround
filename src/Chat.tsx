import React, { useState } from 'react';
import { DeepChat } from 'deep-chat-react';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);

  const handleNewMessage = (message: any) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div className="chat-wrapper">
      <DeepChat
        directConnection={{
          openAI: {
            key: '',
            chat: {
              model: 'groq/llama3-70b-8192'
            },
          }
        }}
        connect={{ url: 'https://one-api.lrfz.com/v1/chat/completions' }}
        style={{ borderRadius: '8px', width: '100%', height: '100%' }}
        messageStyles={{
          default: {
            shared: { bubble: { backgroundColor: '#f0f0f0', padding: '8px' } },
          },
        }}
        textInput={{ placeholder: { text: 'Ask about the code...' } }}
        submitButtonStyles={{
          submit: { container: { default: { backgroundColor: '#007bff' } } },
        }}
        onNewMessage={handleNewMessage}
        demo={true}
      />
    </div>
  );
};

export default Chat;
