import { Flex, Text, TextVariants, TextContent } from '@patternfly/react-core';
import { ActionButton, IActionButtonProps } from '../ActionButton/ActionButton';

interface IActionHeaderProps extends IActionButtonProps {
  children?: React.ReactNode;
}

const flexJustifyContent = { default: 'justifyContentSpaceBetween' };
const flexAlignItems = { default: 'alignItemsCenter' };

export const ActionHeader = ({ actionType, link, children }: IActionHeaderProps) => (
  <Flex
    justifyContent={flexJustifyContent as { default: 'justifyContentSpaceBetween' }}
    alignItems={flexAlignItems as { default: 'alignItemsCenter' }}
    className="m-b-10"
  >
    <TextContent>
      <Text component={TextVariants.h2}>{children}</Text>
    </TextContent>
    <ActionButton actionType={actionType} link={link} />
  </Flex>
);
