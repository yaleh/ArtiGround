import React, { useEffect, useState } from 'react';
import { useSandpack } from "@codesandbox/sandpack-react";

export const SandpackController: React.FC = () => {
  const { sandpack, listen } = useSandpack();
  const [fileUpdateTrigger, setFileUpdateTrigger] = useState(0);

  useEffect(() => {
    // Use the listen function directly from useSandpack
    const unsubscribe = listen((message) => {
      if (message.type === "start" && message.codesandbox === true) {
        console.log("Sandpack started:", message.$id);
        // Trigger a re-render of SandpackFileExplorer
        setFileUpdateTrigger(prev => prev + 1);
        // Dispatch custom event
        window.dispatchEvent(new Event('sandpack-file-update'));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [listen]);

  // Expose methods to interact with Sandpack
  const getFiles = () => {
    return sandpack.files;
  };

  const updateFile = (path: string, code: string) => {
    sandpack.updateFile(path, code);
    // Trigger a re-render of SandpackFileExplorer
    setFileUpdateTrigger(prev => prev + 1);
    // Dispatch custom event
    window.dispatchEvent(new Event('sandpack-file-update'));
  };

  // Add this method to the global window object
  // (Not recommended for production, just for demonstration)
  if (typeof window !== 'undefined') {
    (window as any).sandpackController = {
      getFiles,
      updateFile,
    };
  }

  return null; // This component doesn't render anything
};
