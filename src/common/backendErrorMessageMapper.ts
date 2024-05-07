export const backendErrorMessageMapper = (errorStatus: number, backendErrorMessage: string): string => {
  if (errorStatus === 401) {
    return `Action was not successful, please login first and try again. [${backendErrorMessage}]`;
  }

  if (errorStatus === 409) {
    if (/SCM Repository.*already exists/.test(backendErrorMessage)) {
      return 'SCM repository with the external URL already exists.';
    }

    return `Action was not successful due to the conflict with the current state of the target resource. Please, refresh the page and try again. [HTTP 409 Conflict]`;
  }

  return backendErrorMessage;
};
