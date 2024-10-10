import React from 'react';
import { Sandpack, SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from "@codesandbox/sandpack-react";
import { SandpackFileExplorer } from 'sandpack-file-explorer';

const SandpackEditor = ({ template }) => {
  return (
    <SandpackProvider template={template} key={template}>
      <SandpackLayout>
        <SandpackFileExplorer />
        <SandpackCodeEditor />
        <SandpackPreview />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export default SandpackEditor;