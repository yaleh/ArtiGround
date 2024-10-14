import React, { useEffect } from 'react';
import { useSandpack } from "@codesandbox/sandpack-react";

export const SandpackController: React.FC = () => {
  const { sandpack, listen } = useSandpack();

  useEffect(() => {
    // Use the listen function directly from useSandpack
    const unsubscribe = listen((message) => {
      if (message.type === "file" && message.event === "change") {
        console.log("File changed:", message.filePath);
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
