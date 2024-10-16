import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { DeepChat } from 'deep-chat-react';
import { Button, Box } from '@mui/material';
import ChatSettings from './ChatSettings';
import { useSystemPrompt, SystemPromptProvider } from './SystemPromptContext';
import { updateHistory } from './utils/historyUtils';
import { interceptRequest } from './utils/requestInterceptor';
import { processResponseArtifacts, Artifact } from './utils/responseInterceptor';
import { useArtiGround } from './ArtiGroundContext';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorIcon from '@mui/icons-material/Error';
import UndoIcon from '@mui/icons-material/Undo';
// Add this import
import DownloadIcon from '@mui/icons-material/Download';
// Add this import for JSZip
import JSZip from 'jszip';
import { useTheme, useMediaQuery } from '@mui/material';

const ChatContent: React.FC = () => {
  const [url, setUrl] = useState('https://api.openai.com/v1/chat/completions');
  const [urlHistory, setUrlHistory] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyHistory, setApiKeyHistory] = useState<string[]>([]);
  const [model, setModel] = useState('gpt-4o');
  const [modelHistory, setModelHistory] = useState<string[]>([]);
  const [reload, setReload] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [fileList, setFileList] = useState<string[]>([]);
  const { logs, sandpackController } = useArtiGround();
  const [lastError, setLastError] = useState<string | Record<string, string> | null>(null);
  const [isErrorButtonEnabled, setIsErrorButtonEnabled] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);

  const chatRef = useRef<any>(null);

  const { systemPrompt } = useSystemPrompt();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
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
  }, [url, apiKey, model]);

  useEffect(() => {
    if (sandpackController) {
      const files = sandpackController.getFiles();
      const paths = Object.keys(files);
      setFileList(paths);
    }
  }, [sandpackController]);

  useEffect(() => {
    if (Array.isArray(logs)) {
      const lastErrorLog = logs
        .filter(log => log.method === "error")
        .pop();
      
      if (lastErrorLog && lastErrorLog.data && lastErrorLog.data[0]) {
        console.log("Last Error:", lastErrorLog.data[0]);
        setLastError(lastErrorLog.data[0]);
        setIsErrorButtonEnabled(true);
      }
    } else {
      console.warn("logs is not an array:", logs);
    }
  }, [logs]);

  const variables = useMemo(() => ({
    fileList: JSON.stringify(fileList)
  }), [fileList]);

  const handleUpdateHistory = useCallback((
    value: string, 
    history: string[], 
    setHistory: React.Dispatch<React.SetStateAction<string[]>>, 
    key: string
  ) => {
    if (!isInitialLoad) {
      const updatedHistory = updateHistory(value, history);
      setHistory(updatedHistory);
      localStorage.setItem(key, JSON.stringify(updatedHistory));
    }
  }, [isInitialLoad]);

  const handleUrlConfirm = useCallback(() => {
    handleUpdateHistory(url, urlHistory, setUrlHistory, 'urlHistory');
  }, [url, urlHistory, handleUpdateHistory]);

  const handleApiKeyConfirm = useCallback(() => {
    handleUpdateHistory(apiKey, apiKeyHistory, setApiKeyHistory, 'apiKeyHistory');
  }, [apiKey, apiKeyHistory, handleUpdateHistory]);

  const handleModelConfirm = useCallback(() => {
    handleUpdateHistory(model, modelHistory, setModelHistory, 'modelHistory');
  }, [model, modelHistory, handleUpdateHistory]);

  const handleClearChat = () => {
    if (chatRef.current) {
      chatRef.current.clearMessages();
      setIsErrorButtonEnabled(false);
      setHasMessages(false);
    }
  };

  const handleRequestInterceptor = useCallback((requestDetails: any) => {
    setIsErrorButtonEnabled(false);
    setHasMessages(true);
    return interceptRequest(systemPrompt, requestDetails, variables, sandpackController);
  }, [systemPrompt, variables, sandpackController]);

  const handleResponseInterceptor = useCallback((response: any) => {
    if (response && response.choices && Array.isArray(response.choices)) {
      return {
        ...response,
        choices: response.choices.map((choice: any) => {
          const { modifiedText, artifacts } = processResponseArtifacts(choice.message.content);
          
          // Update files using SandpackController
          if (artifacts.length > 0 && sandpackController) {
            artifacts.forEach((artifact: Artifact) => {
              sandpackController.updateFile(artifact.filepath, artifact.content);
            });
          }

          return {
            ...choice,
            message: {
              ...choice.message,
              content: modifiedText,
              artifacts: artifacts
            }
          };
        })
      };
    }
    return response;
  }, [sandpackController]);

  const handleAddErrorToChat = () => {
    if (lastError && chatRef.current) {
      chatRef.current.addMessage({
        text: `Last Error: ${lastError}`,
        role: 'user'
      });
      setIsErrorButtonEnabled(false);
    }
  };

  const handleRevokeLastMessage = () => {
    if (chatRef.current) {
      const messages = chatRef.current.getMessages();
      if (messages.length > 0) {
        const lastMessage = messages.pop();
        chatRef.current.clearMessages(true);
        messages.forEach((message: any) => chatRef.current.addMessage(message));

        if (lastMessage.role === 'user' && lastMessage.text) {
          setInputText(lastMessage.text);
        }

        setIsErrorButtonEnabled(false);
        setHasMessages(messages.length > 0);
      }
    }
  };

  const setInputText = useCallback((text: string) => {
    if (chatRef.current) {
      // Wait for the next tick to ensure the shadow DOM is fully rendered
      setTimeout(() => {
        const shadowRoot = chatRef.current.shadowRoot;
        const inputElement = shadowRoot?.querySelector('#text-input') as HTMLDivElement | null;
        if (inputElement) {
          inputElement.textContent = text;
          // Trigger an input event to ensure DeepChat's internal state is updated
          const event = new Event('input', { bubbles: true });
          inputElement.dispatchEvent(event);
        } else {
          console.error('Could not find the input element');
        }
      }, 0);
    }
  }, []);

  // Update this function to automatically trigger the download
  const handleDownloadFiles = useCallback(() => {
    if (sandpackController) {
      const files = sandpackController.getFiles();
      const zip = new JSZip();

      Object.entries(files).forEach(([path, content]) => {
        // Remove the leading "/" from the path
        const filePath = path.replace(/^\//, '');
        const fileContent = typeof content === 'string' ? content : JSON.stringify(content);
        zip.file(filePath, fileContent);
      });

      zip.generateAsync({ type: "blob" }).then((content) => {
        const url = window.URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'project_files.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }).catch((error) => {
        console.error('Error generating zip file:', error);
      });
    }
  }, [sandpackController]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ChatSettings
        url={url}
        setUrl={setUrl}
        urlHistory={urlHistory}
        apiKey={apiKey}
        setApiKey={setApiKey}
        apiKeyHistory={apiKeyHistory}
        model={model}
        setModel={setModel}
        modelHistory={modelHistory}
        handleUrlConfirm={handleUrlConfirm}
        handleApiKeyConfirm={handleApiKeyConfirm}
        handleModelConfirm={handleModelConfirm}
        isInitialLoad={isInitialLoad}
      />
      
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <DeepChat
          ref={chatRef}
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
          style={{ borderRadius: '4px', width: '100%', height: '100%', maxHeight: isMobile ? '500px' : '100%' }}
          messageStyles={{
            default: {
              shared: {
                bubble: {
                  maxWidth: '100%',
                  backgroundColor: 'unset',
                  marginTop: '10px',
                  marginBottom: '10px'
                }
              },
              user: {
                bubble: {
                  marginLeft: '0px',
                  color: 'black'
                }
              },
              ai: {
                outerContainer: {
                  backgroundColor: 'rgba(247,247,248)',
                  borderTop: '1px solid rgba(0,0,0,.1)',
                  borderBottom: '1px solid rgba(0,0,0,.1)'
                }
              }
            }
          }}
          textInput={{ placeholder: { text: 'Ask about the code...' } }}
          submitButtonStyles={{
            submit: { container: { default: { backgroundColor: '#007bff' } } },
          }}
          requestInterceptor={handleRequestInterceptor}
          responseInterceptor={handleResponseInterceptor}
          demo={true}
          onMessage={() => setHasMessages(true)}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Button 
          variant="contained" 
          color="inherit"
          onClick={handleClearChat}
          sx={{ backgroundColor: 'grey.400' }}
          disabled={!hasMessages}
        >
          <DeleteIcon />
        </Button>
        <Button 
          variant="contained" 
          color="secondary"
          onClick={handleAddErrorToChat}
          disabled={!isErrorButtonEnabled}
        >
          <ErrorIcon />
        </Button>
        <Button 
          variant="contained" 
          color="warning"
          onClick={handleRevokeLastMessage}
          disabled={!hasMessages}
        >
          <UndoIcon />
        </Button>
        {/* Add this new button */}
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleDownloadFiles}
          disabled={!sandpackController}
        >
          <DownloadIcon />
        </Button>
      </Box>
    </Box>
  );
};

const Chat: React.FC = () => {
  return (
    <SystemPromptProvider>
      <ChatContent />
    </SystemPromptProvider>
  );
};

export default Chat;
