import { css } from '@patternfly/react-styles';
import { PropsWithChildren } from 'react';

interface IPlainContentBoxProps extends PropsWithChildren {
  marginTop?: boolean;
  marginBottom?: boolean;
  className?: string;
}

/**
 * Plain variant of ContentBox component (simple div) containing contents with general style control.
 *
 * @param marginTop - Whether to set margin above the box
 * @param marginBottom - Whether to set margin below the box
 */
export const PlainContentBox = ({ marginBottom, marginTop, className, children }: IPlainContentBoxProps) => (
  <div className={css(marginTop && 'm-t-global', marginBottom && 'm-b-global', className)}>{children}</div>
);
