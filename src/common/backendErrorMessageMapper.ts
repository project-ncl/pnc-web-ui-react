export const backendErrorMessageMapper = (errorStatus: number, backendErrorMessage: string): string => {
  if (errorStatus === 401) {
    return `Action was not successful, please login first and try again. [${backendErrorMessage}]`;
  }

  if (errorStatus === 403) {
    if (/rate limit exceeded/.test(backendErrorMessage)) {
      return 'API rate limit exceeded. Please, try again later.';
    }
  }

  if (errorStatus === 409) {
    if (/SCM Repository.*already exists/.test(backendErrorMessage)) {
      return 'SCM repository with the external URL already exists.';
    }

    if (/Artifact.*cannot be changed to another quality level/.test(backendErrorMessage)) {
      return backendErrorMessage.replace(/Artifact \d+/, 'Artifact');
    }

    if (/Build push.*already in progress/.test(backendErrorMessage)) {
      return backendErrorMessage;
    }

    const labelMatch = backendErrorMessage.match(/Unable to add the label (\w+)/);
    if (labelMatch) {
      const label = labelMatch[1];
      const errorReason = backendErrorMessage.split(': ').pop() || '';

      return `Label ${label} cannot be assigned${errorReason ? `: ${errorReason}.` : '.'}`;
    }

    return `Action was not successful due to the conflict with the current state of the target resource. Please, refresh the page and try again. [HTTP 409 Conflict]`;
  }

  return backendErrorMessage;
};
