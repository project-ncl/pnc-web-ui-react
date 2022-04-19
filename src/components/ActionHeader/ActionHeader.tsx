import { Flex } from '@patternfly/react-core';
import { ActionButton, IActionButtonProps } from '../ActionButton/ActionButton';

interface IActionHeaderProps extends IActionButtonProps {
  children?: React.ReactNode;
}

export const ActionHeader = ({ actionType, children }: IActionHeaderProps) => (
  <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
    {children} <ActionButton actionType={actionType} />
  </Flex>
);
