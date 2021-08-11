import React, { createContext, useState } from 'react';
import { WebConfigAPI, IWebConfig } from './WebConfigAPI';

export const WebConfigContext = createContext<IWebConfig>({ config: null });

export const WebConfigProvider = ({ children }: { children: React.ReactChild }) => {
  const [webConfig] = useState<IWebConfig>(WebConfigAPI.getWebConfig());

  return <WebConfigContext.Provider value={webConfig}>{children}</WebConfigContext.Provider>;
};
