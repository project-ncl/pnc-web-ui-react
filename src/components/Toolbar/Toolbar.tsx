import { Flex, FlexProps } from '@patternfly/react-core';

import { ContentBox } from 'components/ContentBox/ContentBox';

const gapLg: FlexProps['gap'] = { default: 'gapLg' };
const directionColumn: FlexProps['direction'] = { default: 'column' };

interface IToolbarProps {
  borderTop?: boolean;
  borderBottom?: boolean;
  padding?: boolean;
  disablePaddingTop?: boolean;
  disablePaddingBottom?: boolean;
  column?: boolean;
}

export const Toolbar = ({
  children,
  borderTop,
  borderBottom,
  padding = true,
  disablePaddingTop,
  disablePaddingBottom,
  column = false,
}: React.PropsWithChildren<IToolbarProps>) => (
  <ContentBox
    borderTop={borderTop}
    borderBottom={borderBottom}
    paddingTop={padding && !disablePaddingTop}
    paddingBottom={padding && !disablePaddingBottom}
    paddingLeft={padding}
    paddingRight={padding}
  >
    <Flex direction={column ? directionColumn : undefined} gap={gapLg}>
      {children}
    </Flex>
  </ContentBox>
);
