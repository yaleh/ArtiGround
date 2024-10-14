import React from 'react';
import { Sandpack, SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, SandpackConsole } from "@codesandbox/sandpack-react";
import { SandpackFileExplorer } from 'sandpack-file-explorer';
import { useTemplate } from './TemplateContext';
import { useTheme, useMediaQuery, Box } from '@mui/material';
import { SandpackController } from './SandpackController';

const SandpackEditor: React.FC = () => {
  const { selectedTemplate } = useTemplate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <SandpackProvider
      template={selectedTemplate}
      key={selectedTemplate}
      style={{ height: '100%' }}
    >
      <Box sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <SandpackLayout style={{ flex: 1, minHeight: 0 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: isMobile ? 'auto' : '100%',
            overflow: 'hidden',
            width: '100%'
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              height: isMobile ? '100%' : '80%',
              overflow: 'hidden',
              width: '100%'
            }}>
              <Box sx={{
                width: isMobile ? '100%' : '200px',
                height: isMobile ? '200px' : '100%',
                overflow: 'hidden'
              }}>
                <SandpackFileExplorer />
              </Box>
              <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                flex: 1,
                overflow: 'hidden'
              }}>
                <SandpackCodeEditor
                  showTabs={true}
                  showLineNumbers={true}
                  closableTabs={true}
                  style={{
                    height: isMobile ? '300px' : '100%',
                    flex: 1,
                    width: isMobile ? '100%' : '50%',
                  }}
                />
                <SandpackPreview
                  showNavigator={true}
                  showRefreshButton={true}
                  style={{
                    height: isMobile ? '300px' : '100%',
                    flex: 1,
                    width: isMobile ? '100%' : '50%',
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ height: isMobile ? '200px' : '20%', minHeight: '100px' }}>
              <SandpackConsole
                standalone
                style={{
                  height: '100%',
                }}
              />
            </Box>
          </Box>
        </SandpackLayout>
      </Box>
      <SandpackController />
    </SandpackProvider>
  );
};

export default SandpackEditor;
