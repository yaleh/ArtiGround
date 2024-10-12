import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DeepChat } from 'deep-chat-react';
import { Autocomplete, TextField, Button, Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
  const [systemPrompt, setSystemPrompt] = useState('');

  const chatRef = useRef<any>(null);

  useEffect(() => {
    // Load history from localStorage
    const loadHistory = (key: string) => {
      const savedHistory = localStorage.getItem(key);
      if (savedHistory) {
        try {
          return JSON.parse(savedHistory);
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
  }, [url, apiKey, model, systemPrompt]);

  const handleNewMessage = (message: any) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const updateHistory = useCallback((value: string, history: string[], setHistory: React.Dispatch<React.SetStateAction<string[]>>, key: string) => {
    if (value && !isInitialLoad) {
      const updatedHistory = Array.from(new Set([value, ...history])).slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem(key, JSON.stringify(updatedHistory));
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

  const handleSystemPromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(event.target.value);
  };

  const handleClearChat = () => {
    if (chatRef.current) {
      chatRef.current.clearMessages();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Chat Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
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
            <TextField
              multiline
              minRows={2}
              maxRows={10}
              value={systemPrompt}
              onChange={handleSystemPromptChange}
              placeholder="Enter system prompt here..."
              fullWidth
              variant="outlined"
              style={{ marginTop: '10px', resize: 'vertical' }}
            />
          </div>
        </AccordionDetails>
      </Accordion>
      
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <DeepChat
          ref={chatRef}
          key={reload}
          directConnection={{
            openAI: {
              key: apiKey,
              chat: {
                model: model,
                system_prompt: systemPrompt
              },
            }
          }}
          connect={{ url: url }}
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
      </Box>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleClearChat}
        sx={{ mt: 1 }}
      >
        Reset Chat
      </Button>
    </Box>
  );
};

export default Chat;
