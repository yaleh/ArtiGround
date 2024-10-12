import React from 'react';
import { useTemplate } from './TemplateContext';

const templates = [
  'static',
  'angular',
  'react',
  'react-ts',
  'solid',
  'svelte',
  'vanilla',
  'vanilla-ts',
  'vue',
  'vue-ts'
] as const;

const TemplateSelector: React.FC = () => {
  const { selectedTemplate, setSelectedTemplate } = useTemplate();

  return (
    <div className="template-selector">
      <label htmlFor="template-select">Template: </label>
      <select
        id="template-select"
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value as typeof templates[number])}
      >
        {templates.map((template) => (
          <option key={template} value={template}>
            {template}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TemplateSelector;

