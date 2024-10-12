import React, { useState, useEffect } from 'react';
import { DeepChat } from 'deep-chat-react';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [url, setUrl] = useState('https://api.openai.com/v1/chat/completions');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [reload, setReload] = useState(0);

  const handleNewMessage = (message: any) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  useEffect(() => {
    setReload(prev => prev + 1);
  }, [url, apiKey, model]);

  return (
    <div className="chat-wrapper">
      <div className="chat-inputs">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="API URL"
        />
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="API Key"
        />
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Model"
        />
      </div>
      <DeepChat
        key={reload}
        directConnection={{
          openAI: {
            key: apiKey,
            chat: {
              model: model
            },
          }
        }}
        connect={{ url: url }}
        style={{ borderRadius: '8px', width: '100%', height: 'calc(100% - 40px)' }}
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
