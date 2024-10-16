import React from 'react';
import { useTemplate } from './TemplateContext';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

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
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="template-select-label" sx={{ color: 'common.white' }}>Template</InputLabel>
      <Select
        labelId="template-select-label"
        id="template-select"
        value={selectedTemplate}
        label="Template"
        onChange={(e) => setSelectedTemplate(e.target.value as typeof templates[number])}
        sx={{
          color: 'common.white',
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'common.white',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'common.white',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'common.white',
          },
          '& .MuiSvgIcon-root': {
            color: 'common.white',
          },
        }}
      >
        {templates.map((template) => (
          <MenuItem key={template} value={template}>
            {template}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TemplateSelector;
