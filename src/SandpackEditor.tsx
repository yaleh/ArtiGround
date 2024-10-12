import React from 'react';
import { Sandpack, SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, SandpackConsole } from "@codesandbox/sandpack-react";
import { SandpackFileExplorer } from 'sandpack-file-explorer';
import { useTemplate } from './TemplateContext';

const SandpackEditor: React.FC = () => {
  const { selectedTemplate } = useTemplate();

  return (
    <SandpackProvider
      template={selectedTemplate}
      key={selectedTemplate}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <SandpackLayout style={{ flex: 1, minHeight: 0 }}>
        <SandpackFileExplorer />
        <SandpackCodeEditor
          showTabs={true}
          showLineNumbers={true}
          closableTabs={true}
          style={{
            height: '100%',
            overflow: 'auto',
            flexGrow: 0.5,
            flexShrink: 0.5,
          }}
        />
        <SandpackPreview
          showNavigator={true}
          showRefreshButton={true}
          style={{
            height: '100%',
          }}
        />
      </SandpackLayout>
      <div style={{ height: '20%', minHeight: '100px' }}>
        <SandpackConsole
          standalone
          style={{
            height: '100%',
          }}
        />
      </div>
    </SandpackProvider>
  );
};

export default SandpackEditor;
