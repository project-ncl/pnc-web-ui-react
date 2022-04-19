import { Flex } from '@patternfly/react-core';
import { ActionButton, IActionButtonProps } from '../ActionButton/ActionButton';

interface IActionHeaderProps extends IActionButtonProps {
  text: string;
}

export const ActionHeader = ({ text, ...actionButtonProps }: IActionHeaderProps) => (
  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
    {text} <ActionButton {...actionButtonProps} />
  </Flex>
);
