import { Flex, Text, TextVariants, TextContent, FlexProps } from '@patternfly/react-core';

interface ISectionHeaderProps {
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

const flexJustifyContent: FlexProps['justifyContent'] = { default: 'justifyContentSpaceBetween' };
const flexJustifyContentNoChildren: FlexProps['justifyContent'] = { default: 'justifyContentFlexEnd' };
const flexAlignItems: FlexProps['alignItems'] = { default: 'alignItemsCenter' };

/**
 * Layout component for section headers.
 *
 * @param children - the content of the (textual) heading
 * @param actions - the content on the opposite (right) side of the main heading component
 */
export const SectionHeader = ({ children, actions }: ISectionHeaderProps) => (
  <Flex
    justifyContent={children ? flexJustifyContent : flexJustifyContentNoChildren}
    alignItems={flexAlignItems}
    className="m-b-10"
  >
    {children && (
      <TextContent>
        <Text component={TextVariants.h2}>{children}</Text>
      </TextContent>
    )}
    {actions}
  </Flex>
);
