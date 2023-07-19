import { css } from '@patternfly/react-styles';
import { PropsWithChildren } from 'react';

import { BoxDescription, IDescription } from 'components/BoxDescription/BoxDescription';

import styles from './ContentBox.module.css';

interface IContentBoxProps {
  shadow?: boolean;
  background?: boolean;
  borderTop?: boolean;
  padding?: boolean;
  paddingTop?: boolean;
  paddingBottom?: boolean;
  paddingLeft?: boolean;
  paddingRight?: boolean;
  marginTop?: boolean;
  marginBottom?: boolean;
  title?: string;
  contentHeight?: string;
  description?: IDescription;
  isResponsive?: boolean;
}

export const ContentBox = ({
  children,
  shadow = true,
  background = true,
  borderTop,
  padding,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  marginTop,
  marginBottom,
  title,
  contentHeight,
  description,
  isResponsive = false,
}: PropsWithChildren<IContentBoxProps>) => {
  const classList = [];

  if (shadow) {
    classList.push(styles['shadow-global']);
  }

  if (background) {
    classList.push(styles['bg-w']);
  }

  if (borderTop) {
    classList.push(styles['border-t-gray']);
  }

  if (padding) {
    classList.push('p-global');
  }

  if (paddingTop) {
    classList.push('p-t-global');
  }

  if (paddingBottom) {
    classList.push('p-b-global');
  }

  if (paddingLeft) {
    classList.push('p-l-global');
  }

  if (paddingRight) {
    classList.push('p-r-global');
  }

  if (marginTop) {
    classList.push('m-t-25');
  }

  if (marginBottom) {
    classList.push(styles['margin-bottom']);
  }

  return (
    <div className={classList.join(' ')}>
      {title && (
        <div className="p-b-10">
          <strong>{title}</strong>
        </div>
      )}
      {description && <BoxDescription description={description} />}
      <div
        style={contentHeight ? { height: contentHeight } : undefined}
        className={css(isResponsive && styles['responsive-content'])}
      >
        {children}
      </div>
    </div>
  );
};
