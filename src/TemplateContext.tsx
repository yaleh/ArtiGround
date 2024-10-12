import React, { createContext, useState, useContext } from 'react';

type Template = 'static' | 'angular' | 'react' | 'react-ts' | 'solid' | 'svelte' | 'vanilla' | 'vanilla-ts' | 'vue' | 'vue-ts';

interface TemplateContextType {
  selectedTemplate: Template;
  setSelectedTemplate: React.Dispatch<React.SetStateAction<Template>>;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const TemplateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('react-ts');

  return (
    <TemplateContext.Provider value={{ selectedTemplate, setSelectedTemplate }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplate must be used within a TemplateProvider');
  }
  return context;
};