import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SystemPromptContextType {
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
}

const SystemPromptContext = createContext<SystemPromptContextType | undefined>(undefined);

export const useSystemPrompt = () => {
  const context = useContext(SystemPromptContext);
  if (!context) {
    throw new Error('useSystemPrompt must be used within a SystemPromptProvider');
  }
  return context;
};

export const SystemPromptProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [systemPrompt, setSystemPrompt] = useState('');

  return (
    <SystemPromptContext.Provider value={{ systemPrompt, setSystemPrompt }}>
      {children}
    </SystemPromptContext.Provider>
  );
};