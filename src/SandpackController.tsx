import React, { useEffect, useState, useCallback } from 'react';
import { useSandpack } from "@codesandbox/sandpack-react";

interface SandpackControllerProps {
  setSandpackController: React.Dispatch<React.SetStateAction<{
    getFiles: () => Record<string, string>;
    updateFile: (path: string, code: string) => void;
  } | null>>;
}

export const SandpackController: React.FC<SandpackControllerProps> = ({ setSandpackController }) => {
  const { sandpack, listen } = useSandpack();
  const [fileUpdateTrigger, setFileUpdateTrigger] = useState(0);

  const getFiles = useCallback(() => {
    return sandpack.files;
  }, [sandpack.files]);

  const updateFile = useCallback((path: string, code: string) => {
    sandpack.updateFile(path, code);
    setFileUpdateTrigger(prev => prev + 1);
    window.dispatchEvent(new Event('sandpack-file-update'));
  }, [sandpack]);

  useEffect(() => {
    setSandpackController({ getFiles, updateFile });
  }, [getFiles, updateFile, setSandpackController]);

  useEffect(() => {
    const unsubscribe = listen((message) => {
      if (message.type === "start" && message.codesandbox === true) {
        setFileUpdateTrigger(prev => prev + 1);
        window.dispatchEvent(new Event('sandpack-file-update'));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [listen]);

  return null;
};
