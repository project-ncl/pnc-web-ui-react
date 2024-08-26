import { Flex, FlexProps } from '@patternfly/react-core';

import { ContentBox } from 'components/ContentBox/ContentBox';

import styles from './Toolbar.module.css';

const spaceItemsNone: FlexProps['spaceItems'] = { default: 'spaceItemsNone' };

interface IToolbarProps {
  borderTop?: boolean;
  borderBottom?: boolean;
  padding?: boolean;
  disablePaddingTop?: boolean;
  disablePaddingBottom?: boolean;
}

export const Toolbar = ({
  children,
  borderTop,
  borderBottom,
  padding = true,
  disablePaddingTop,
  disablePaddingBottom,
}: React.PropsWithChildren<IToolbarProps>) => (
  <ContentBox
    borderTop={borderTop}
    borderBottom={borderBottom}
    paddingTop={padding && !disablePaddingTop}
    paddingBottom={padding && !disablePaddingBottom}
    paddingLeft={padding}
    paddingRight={padding}
  >
    <Flex spaceItems={spaceItemsNone} className={styles['toolbar']}>
      {children}
    </Flex>
  </ContentBox>
);
