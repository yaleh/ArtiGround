import React from 'react';
import { Sandpack, SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, SandpackConsole } from "@codesandbox/sandpack-react";
import { SandpackFileExplorer } from 'sandpack-file-explorer';

interface SandpackEditorProps {
  template: string;
}

const SandpackEditor: React.FC<SandpackEditorProps> = ({ template }) => {
  return (
    <>
      <SandpackProvider
        template={template}
        key={template}
      >
        <SandpackLayout
          style={{ height: '500px' }}
        >
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
        <div style={{ width: '100%', height: '100px' }}>
          <SandpackConsole
            standalone
            style={{
              height: '100%',
            }}
          />
        </div>
      </SandpackProvider>
    </>
  );
};

export default SandpackEditor;