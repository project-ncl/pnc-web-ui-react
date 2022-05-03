import { Flex, Text, TextVariants, TextContent, FlexProps } from '@patternfly/react-core';

interface ISectionHeaderProps {
  children?: React.ReactNode;
  sideComponent?: React.ReactNode;
}

const flexJustifyContent: FlexProps['justifyContent'] = { default: 'justifyContentSpaceBetween' };
const flexAlignItems: FlexProps['alignItems'] = { default: 'alignItemsCenter' };

/**
 * Layout component for section headers.
 *
 * @param children - the content of the (textual) heading
 * @param sideComponent - the content on the opposite (right) side of the main heading component
 */
export const SectionHeader = ({ children, sideComponent }: ISectionHeaderProps) => (
  <Flex justifyContent={flexJustifyContent} alignItems={flexAlignItems} className="m-b-10">
    <TextContent>
      <Text component={TextVariants.h2}>{children}</Text>
    </TextContent>
    {sideComponent}
  </Flex>
);
