import React, { createContext, useContext, useState } from 'react';
import { SandpackConsoleData } from "@codesandbox/sandpack-react";

interface SandpackController {
  getFiles: () => Record<string, string>;
  updateFile: (path: string, code: string) => void;
}

interface ArtiGroundContextType {
  logs: SandpackConsoleData;
  setLogs: React.Dispatch<React.SetStateAction<SandpackConsoleData>>;
  sandpackController: SandpackController | null;
  setSandpackController: React.Dispatch<React.SetStateAction<SandpackController | null>>;
}

const ArtiGroundContext = createContext<ArtiGroundContextType | undefined>(undefined);

export const ArtiGroundProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [logs, setLogs] = useState<SandpackConsoleData>({ logs: [] });
  const [sandpackController, setSandpackController] = useState<SandpackController | null>(null);

  return (
    <ArtiGroundContext.Provider value={{ logs, setLogs, sandpackController, setSandpackController }}>
      {children}
    </ArtiGroundContext.Provider>
  );
};

export const useArtiGround = () => {
  const context = useContext(ArtiGroundContext);
  if (context === undefined) {
    throw new Error('useArtiGround must be used within an ArtiGroundProvider');
  }
  return context;
};
