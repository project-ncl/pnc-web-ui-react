export interface ExtendedError extends Error {
  fileName: string;
  lineNumber: string;
  columnNumber: string;
}

interface IUILogClient {
  version: string;
  revision: string;
  name: string;
}

interface IUILogUser {
  browser: string;
  language: string;
  userId?: string | null;
}

export interface IUILog {
  client: IUILogClient;
  user: IUILogUser;
  url: string;
  data?: Object;
  name?: string | null;
  message?: string | null;
  stack?: string | null;
}

const log = (message: string, error?: ExtendedError, additionalData?: Object) => {
  return;
};

const error = (message?: string, error?: ExtendedError, additionalData?: Object) => {
  return;
};

export const uiLogger = { log, error };
