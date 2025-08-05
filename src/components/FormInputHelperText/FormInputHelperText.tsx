import { FormHelperText, HelperText, HelperTextItem, HelperTextItemProps } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { PropsWithChildren } from 'react';

interface IFormInputHelperTextProps {
  variant: HelperTextItemProps['variant'];
  isHidden?: boolean;
}

export const FormInputHelperText = ({ variant, isHidden = false, children }: PropsWithChildren<IFormInputHelperTextProps>) => (
  <FormHelperText className={css((isHidden || !children) && 'display-none')}>
    <HelperText>
      <HelperTextItem variant={variant}>{children}</HelperTextItem>
    </HelperText>
  </FormHelperText>
);
