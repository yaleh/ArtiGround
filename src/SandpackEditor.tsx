import React from 'react';
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, SandpackConsole, SandpackFileExplorer } from "@codesandbox/sandpack-react";
import { useTemplate } from './TemplateContext';
import { useTheme, useMediaQuery, Box } from '@mui/material';
import { SandpackController } from './SandpackController';
import { useArtiGround, SandpackConsoleData } from './ArtiGroundContext';
import { useLayout } from './LayoutContext';

const SandpackEditor: React.FC = () => {
  const { selectedTemplate } = useTemplate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { setLogs, setSandpackController } = useArtiGround();
  const { layoutMode } = useLayout();

  const handleLogsChange = (logs: SandpackConsoleData) => {
    setLogs(logs);
  };

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
              height: isMobile || layoutMode === 'default' ? '100%' : '80%',
              overflow: 'hidden',
              width: '100%'
            }}>
              <Box sx={{
                width: isMobile ? '100%' : '200px',
                height: isMobile ? '200px' : '100%',
                overflow: 'hidden',
                display: layoutMode === 'default' ? 'none' : 'block'
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
                    display: layoutMode === 'default' ? 'none' : 'block'
                  }}
                />
                <SandpackPreview
                  showNavigator={true}
                  showRefreshButton={true}
                  style={{
                    height: isMobile ? '300px' : '100%',
                    flex: 1,
                    width: isMobile ? '100%' : layoutMode === 'default' ? '100%' : '50%',
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ 
              height: layoutMode === 'default' ? '0px' : isMobile ? '200px' : '20%', 
              minHeight: layoutMode === 'default' ? '0px' : '100px',
              display: layoutMode === 'default' ? 'none' : 'block'
            }}>
              <SandpackConsole
                standalone
                style={{
                  height: '100%',
                }}
                onLogsChange={handleLogsChange}
              >
                {/* <SandpackConsoleController /> */}
              </SandpackConsole>
            </Box>
          </Box>
        </SandpackLayout>
      </Box>
      <SandpackController setSandpackController={setSandpackController} />
    </SandpackProvider>
  );
};

export default SandpackEditor;
