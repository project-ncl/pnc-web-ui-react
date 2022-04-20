import { Flex } from '@patternfly/react-core';
import { ActionButton, IActionButtonProps } from '../ActionButton/ActionButton';

interface IActionHeaderProps extends IActionButtonProps {
  children?: React.ReactNode;
}

const flexJustifyContent = { default: 'justifyContentSpaceBetween' };

export const ActionHeader = ({ actionType, children }: IActionHeaderProps) => (
  <Flex justifyContent={flexJustifyContent as { default: 'justifyContentSpaceBetween' }}>
    {children} <ActionButton actionType={actionType} />
  </Flex>
);
