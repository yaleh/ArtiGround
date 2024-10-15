import React, { createContext, useContext, useState } from 'react';
import { SandpackConsoleData } from "@codesandbox/sandpack-react";

interface ArtiGroundContextType {
  logs: SandpackConsoleData;
  setLogs: React.Dispatch<React.SetStateAction<SandpackConsoleData>>;
}

const ArtiGroundContext = createContext<ArtiGroundContextType | undefined>(undefined);

export const ArtiGroundProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [logs, setLogs] = useState<SandpackConsoleData>({ logs: [] });

  return (
    <ArtiGroundContext.Provider value={{ logs, setLogs }}>
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
