import React, { useState, useEffect, useCallback } from 'react';
import { DeepChat } from 'deep-chat-react';
import { Autocomplete, TextField } from '@mui/material';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [url, setUrl] = useState('https://api.openai.com/v1/chat/completions');
  const [urlHistory, setUrlHistory] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyHistory, setApiKeyHistory] = useState<string[]>([]);
  const [model, setModel] = useState('gpt-4o');
  const [modelHistory, setModelHistory] = useState<string[]>([]);
  const [reload, setReload] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Load history from localStorage
    const loadHistory = (key: string) => {
      const savedHistory = localStorage.getItem(key);
      console.log(`Loading ${key} history from localStorage:`, savedHistory);
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          console.log(`Parsed ${key} history:`, parsedHistory);
          return parsedHistory;
        } catch (error) {
          console.error(`Error parsing ${key} history:`, error);
        }
      }
      return [];
    };

    setUrlHistory(loadHistory('urlHistory'));
    setApiKeyHistory(loadHistory('apiKeyHistory'));
    setModelHistory(loadHistory('modelHistory'));
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    setReload(prev => prev + 1);
  }, [url, apiKey, model]);

  const handleNewMessage = (message: any) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const updateHistory = useCallback((value: string, history: string[], setHistory: React.Dispatch<React.SetStateAction<string[]>>, key: string) => {
    if (value && !isInitialLoad) {
      const updatedHistory = Array.from(new Set([value, ...history])).slice(0, 10);
      console.log(`Updating ${key} history:`, updatedHistory);
      setHistory(updatedHistory);
      localStorage.setItem(key, JSON.stringify(updatedHistory));
      console.log(`Saved ${key} history to localStorage`);
    }
  }, [isInitialLoad]);

  const handleUrlChange = useCallback((event: React.ChangeEvent<{}>, newValue: string | null) => {
    if (newValue) {
      setUrl(newValue);
      updateHistory(newValue, urlHistory, setUrlHistory, 'urlHistory');
    }
  }, [urlHistory, updateHistory]);

  const handleApiKeyChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setApiKey(newValue);
    updateHistory(newValue, apiKeyHistory, setApiKeyHistory, 'apiKeyHistory');
  }, [apiKeyHistory, updateHistory]);

  const handleModelChange = useCallback((event: React.ChangeEvent<{}>, newValue: string | null) => {
    if (newValue) {
      setModel(newValue);
      updateHistory(newValue, modelHistory, setModelHistory, 'modelHistory');
    }
  }, [modelHistory, updateHistory]);

  console.log('Current URL history state:', urlHistory);
  console.log('Current API Key history state:', apiKeyHistory);
  console.log('Current Model history state:', modelHistory);

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
        <Autocomplete
          freeSolo
          options={apiKeyHistory}
          value={apiKey}
          onInputChange={(event, newValue) => {
            if (newValue !== null) {
              handleApiKeyChange({ target: { value: newValue } } as React.ChangeEvent<HTMLInputElement>);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              type="password"
              placeholder="API Key"
            />
          )}
        />
        <Autocomplete
          freeSolo
          options={modelHistory}
          value={model}
          onInputChange={handleModelChange}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Model"
            />
          )}
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
