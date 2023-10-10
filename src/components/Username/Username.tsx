import { Label } from '@patternfly/react-core';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

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
  const removeKeyword = 'service-account-';
  const resultText = text.replace(removeKeyword, '').substring(0, length);

  return text !== resultText ? (
    <TooltipWrapper tooltip={text}>
      <span>
        {text.startsWith(removeKeyword) && <Label isCompact>SA</Label>} {resultText}
      </span>
    </TooltipWrapper>
  ) : (
    <>{text}</>
  );
};
