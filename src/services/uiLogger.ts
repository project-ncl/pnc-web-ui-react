// import Bowser from 'bowser';
import * as uiLoggerApi from 'services/uiLoggerApi';
import { userService } from 'services/userService';

interface ExtendedError extends Error {
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

interface IUIError {
  name?: string | null;
  message?: string | null;
  stack?: string | null;
}

export interface IUILog {
  client: IUILogClient;
  user: IUILogUser;
  url: string;
  data?: Object;
  message?: string | null;
  error?: IUIError;
}

const getErrorStack = (error?: ExtendedError): string | null => {
  if (error?.fileName && error?.lineNumber && error?.columnNumber) {
    return `${error?.fileName}:${error?.lineNumber}:${error?.columnNumber}`;
  }

  if (error?.stack) {
    return error.stack;
  }

  return null;
};

const createData = (message?: string, error?: Error, additionalData?: Object): IUILog => {
  return {
    client: {
      version: import.meta.env.VITE_VERSION as string,
      revision: import.meta.env.VITE_GIT_SHORT_SHA as string,
      name: 'reactjs',
    },
    user: {
      browser: navigator.userAgent, // does not specify browser directly
      language: navigator.language,
      userId: userService.getUserId(),
    },
    url: window.location.href,
    data: additionalData,
    message: message,
    error: error && {
      name: error.name,
      message: error.message,
      stack: getErrorStack(error as ExtendedError),
    },
  };
};

const log = (message: string, error?: Error, additionalData?: Object, logToConsole: boolean = true) => {
  if (logToConsole) {
    console.log(message || error?.message);
  }

  if (window.location.hostname === 'localhost') return;

  const uiLogData = createData(message, error, additionalData);
  uiLoggerApi.createUILog(uiLogData).catch((error: Error) => {
    console.error(`UI Logger: log could not be created: ${error.message}`);
  });
};

const error = (message?: string, error?: Error, additionalData?: Object, logToConsole: boolean = true) => {
  if (logToConsole) {
    console.error(message || error?.message);
  }
  log(message || '', error, additionalData, false);
};

export const uiLogger = { log, error };
