import { Flex } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

interface IToolbarProps {
  marginBottom?: boolean;
  column?: boolean;
}

export const Toolbar = ({ children, marginBottom = true, column = false }: React.PropsWithChildren<IToolbarProps>) => (
  <div className={css(marginBottom && 'm-b-global')}>
    <Flex gap={flexGapMd} direction={column ? flexDirectionColumn : undefined}>
      {children}
    </Flex>
  </div>
);

const flexGapMd = { default: 'gapMd' } as const;

const flexDirectionColumn = { default: 'column' } as const;
