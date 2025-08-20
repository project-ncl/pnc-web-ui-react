import { Flex } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

interface IToolbarProps {
  marginBottom?: boolean;
  column?: boolean;
  className?: string;
}

export const Toolbar = ({ children, marginBottom = true, column = false, className }: React.PropsWithChildren<IToolbarProps>) => (
  <div className={css(marginBottom && 'm-b-global--sm', className)}>
    <Flex gap={flexGapSm} direction={column ? flexDirectionColumn : undefined}>
      {children}
    </Flex>
  </div>
);

const flexGapSm = { default: 'gapSm' } as const;

const flexDirectionColumn = { default: 'column' } as const;
