import React, { useCallback, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTemplate } from './TemplateContext';
import { useSystemPrompt } from './SystemPromptContext';

const SYSTEM_PROMPT_TEMPLATES: Record<string, string> = {
  'static': 'You are an expert in static HTML, CSS, and JavaScript.',
  'angular': 'You are an Angular development expert.',
  'react': 'You are a React development expert.',
  'react-ts': 'You are a React with TypeScript development expert.',
  'solid': 'You are a SolidJS development expert.',
  'svelte': 'You are a Svelte development expert.',
  'vanilla': 'You are an expert in vanilla JavaScript development.',
  'vanilla-ts': 'You are an expert in vanilla TypeScript development.',
  'vue': 'You are a Vue.js development expert.',
  'vue-ts': 'You are a Vue.js with TypeScript development expert.',
};

interface ChatSettingsProps {
  url: string;
  setUrl: (url: string) => void;
  urlHistory: string[];
  apiKey: string;
  setApiKey: (apiKey: string) => void;
  apiKeyHistory: string[];
  model: string;
  setModel: (model: string) => void;
  modelHistory: string[];
  handleUrlConfirm: () => void;
  handleApiKeyConfirm: () => void;
  handleModelConfirm: () => void;
  isInitialLoad: boolean;
}

const ChatSettings: React.FC<ChatSettingsProps> = ({
  url,
  setUrl,
  urlHistory,
  apiKey,
  setApiKey,
  apiKeyHistory,
  model,
  setModel,
  modelHistory,
  handleUrlConfirm,
  handleApiKeyConfirm,
  handleModelConfirm,
}) => {
  const { selectedTemplate } = useTemplate();
  const { systemPrompt, setSystemPrompt } = useSystemPrompt();

  useEffect(() => {
    const fetchSystemPrompt = async () => {
      try {
        const response = await fetch(`/public/system_prompts/${selectedTemplate}.md`);
        if (response.ok) {
          const promptText = await response.text();
          setSystemPrompt(promptText);
        } else {
          // Fallback to internal template
          setSystemPrompt(SYSTEM_PROMPT_TEMPLATES[selectedTemplate] || '');
        }
      } catch (error) {
        console.error('Error fetching system prompt:', error);
        // Fallback to internal template
        setSystemPrompt(SYSTEM_PROMPT_TEMPLATES[selectedTemplate] || '');
      }
    };

    fetchSystemPrompt();
  }, [selectedTemplate, setSystemPrompt]);

  const handleUrlChange = useCallback(
    (_event: React.ChangeEvent<{}>, newValue: string | null) => {
      if (newValue !== null) {
        setUrl(newValue);
      }
    },
    [setUrl]
  );

  const handleApiKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setApiKey(newValue);
    },
    [setApiKey]
  );

  const handleModelChange = useCallback(
    (_event: React.ChangeEvent<{}>, newValue: string | null) => {
      if (newValue !== null) {
        setModel(newValue);
      }
    },
    [setModel]
  );

  const handleSystemPromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSystemPrompt(event.target.value);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    confirmHandler: () => void
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      confirmHandler();
    }
  };

  return (
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
                onKeyDown={(event) => handleKeyDown(event, handleUrlConfirm)}
                onBlur={handleUrlConfirm}
              />
            )}
          />

          <Autocomplete
            freeSolo
            options={apiKeyHistory}
            value={apiKey}
            onInputChange={(_event, newValue) => {
              if (newValue !== null) {
                handleApiKeyChange({
                  target: { value: newValue },
                } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                type="password"
                placeholder="API Key"
                onKeyDown={(event) => handleKeyDown(event, handleApiKeyConfirm)}
                onBlur={handleApiKeyConfirm}
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
                onKeyDown={(event) => handleKeyDown(event, handleModelConfirm)}
                onBlur={handleModelConfirm}
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
  );
};

export default ChatSettings;
