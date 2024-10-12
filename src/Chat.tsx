import React, { useState, useEffect, useCallback } from 'react';
import { DeepChat } from 'deep-chat-react';
import { Autocomplete, TextField } from '@mui/material';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [url, setUrl] = useState('https://api.openai.com/v1/chat/completions');
  const [urlHistory, setUrlHistory] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [reload, setReload] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Load URL history from localStorage
    const savedHistory = localStorage.getItem('urlHistory');
    console.log('Loading URL history from localStorage:', savedHistory);
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        console.log('Parsed URL history:', parsedHistory);
        setUrlHistory(parsedHistory);
      } catch (error) {
        console.error('Error parsing URL history:', error);
      }
    }
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    setReload(prev => prev + 1);
  }, [url, apiKey, model]);

  const handleNewMessage = (message: any) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleUrlChange = useCallback((event: React.ChangeEvent<{}>, newValue: string | null) => {
    if (newValue && !isInitialLoad) {
      setUrl(newValue);
      // Update URL history
      const updatedHistory = Array.from(new Set([newValue, ...urlHistory])).slice(0, 10);
      console.log('Updating URL history:', updatedHistory);
      setUrlHistory(updatedHistory);
      localStorage.setItem('urlHistory', JSON.stringify(updatedHistory));
      console.log('Saved URL history to localStorage');
    }
  }, [urlHistory, isInitialLoad]);

  console.log('Current URL history state:', urlHistory);

  return (
    <div className="chat-wrapper">
      <div className="chat-inputs">
        <Autocomplete
          freeSolo
          options={urlHistory}
          value={url}
          onInputChange={handleUrlChange}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="API URL"
            />
          )}
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
