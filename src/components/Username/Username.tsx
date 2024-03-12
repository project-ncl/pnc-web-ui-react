import { Label } from '@patternfly/react-core';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

const SERVICE_ACCOUNT_KEYWORD = 'service-account-';

interface IUsernameProps {
  text: string;
  length?: number;
}

/**
 * The username component that will display a adjusted username.
 * This component needs to be used always when username is displayed to keep consistency on all places.
 *
 * @param text - The raw text of the username to be truncated
 * @param length - The target length for usernames that are too long, by default 20
 */
export const Username = ({ text, length = 20 }: IUsernameProps) => {
  const resultText = truncateUsername(text, length);

  return resultText.length !== text.length ? (
    <TooltipWrapper tooltip={text}>
      <span>
        {text.startsWith(SERVICE_ACCOUNT_KEYWORD) && <Label isCompact>SA</Label>} {resultText}
      </span>
    </TooltipWrapper>
  ) : (
    <>{text}</>
  );
};

const truncateUsername = (username: string, length: number): string => {
  const usernameNoKeywords = username.replace(SERVICE_ACCOUNT_KEYWORD, '');
  const usernameTruncated = usernameNoKeywords.substring(0, length).replace(/-+$/, '');

  return `${usernameTruncated}${usernameTruncated.length !== usernameNoKeywords.length ? '..' : ''}`;
};
