import React from 'react';
import { useLayout } from './LayoutContext';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const LayoutModeSelector: React.FC = () => {
  const { layoutMode, setLayoutMode } = useLayout();

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="layout-mode-select-label" sx={{ color: 'common.white' }}>Layout</InputLabel>
      <Select
        labelId="layout-mode-select-label"
        id="layout-mode-select"
        value={layoutMode}
        label="Layout"
        onChange={(e) => setLayoutMode(e.target.value as 'default' | 'debug')}
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
        <MenuItem value="default">Default</MenuItem>
        <MenuItem value="debug">Debug</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LayoutModeSelector;
