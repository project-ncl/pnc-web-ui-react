import { useContext } from 'react';
import { WebConfigContext } from './WebConfigContext';

export const useWebConfig = () => useContext(WebConfigContext);
