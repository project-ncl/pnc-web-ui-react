import { FormHelperText, HelperText, HelperTextItem, HelperTextItemProps } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';

interface IFormInputHelperTextProps {
  variant: HelperTextItemProps['variant'];
  isHidden?: boolean;
}

export const FormInputHelperText = ({ variant, isHidden = false, children }: PropsWithChildren<IFormInputHelperTextProps>) => (
  <FormHelperText>
    <HelperText>
      <HelperTextItem variant={variant}>{!isHidden && children}</HelperTextItem>
    </HelperText>
  </FormHelperText>
);
