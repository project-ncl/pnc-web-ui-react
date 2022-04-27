import { Flex, Text, TextVariants, TextContent } from '@patternfly/react-core';
import { ActionButton, IActionButtonProps } from '../ActionButton/ActionButton';

interface IActionHeaderProps extends IActionButtonProps {
  children?: React.ReactNode;
}

const flexJustifyContent = { default: 'justifyContentSpaceBetween' };
const flexAlignItems = { default: 'alignItemsCenter' };

/**
 * Component for using the action button in combination with header text.
 *
 * @param actionType - specifies the icon of the action button,
 * @param link - optional prop if the button should serve as a Link component (will redirect to the specified link)
 * @param children - the content of the (textual) header
 */
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
