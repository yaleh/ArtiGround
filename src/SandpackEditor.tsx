import React, { useState, useEffect } from 'react';
import { Sandpack, SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, SandpackConsole, SandpackConsoleData } from "@codesandbox/sandpack-react";
import { SandpackFileExplorer } from 'sandpack-file-explorer';
import { useTemplate } from './TemplateContext';
import { useTheme, useMediaQuery, Box } from '@mui/material';
import { SandpackController } from './SandpackController';
import { useArtiGround } from './ArtiGroundContext';

const SandpackEditor: React.FC = () => {
  const { selectedTemplate } = useTemplate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [fileExplorerKey, setFileExplorerKey] = useState(0);
  const { setLogs, setSandpackController } = useArtiGround();

  useEffect(() => {
    const handleFileUpdate = () => {
      setFileExplorerKey(prev => prev + 1);
    };

    window.addEventListener('sandpack-file-update', handleFileUpdate);

    return () => {
      window.removeEventListener('sandpack-file-update', handleFileUpdate);
    };
  }, []);

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
              height: isMobile ? '100%' : '80%',
              overflow: 'hidden',
              width: '100%'
            }}>
              <Box sx={{
                width: isMobile ? '100%' : '200px',
                height: isMobile ? '200px' : '100%',
                overflow: 'hidden'
              }}>
                <SandpackFileExplorer key={fileExplorerKey} />
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
