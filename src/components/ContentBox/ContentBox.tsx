import { PropsWithChildren } from 'react';

import { DescriptionIcon, IDescription } from 'components/DescriptionIcon/DescriptionIcon';

import styles from './ContentBox.module.css';

interface IContentBoxProps {
  shadow?: boolean;
  background?: boolean;
  borderTop?: boolean;
  padding?: boolean;
  marginBottom?: boolean;
  title?: string;
  contentHeight?: string;
  description?: IDescription | string;
}

export const ContentBox = ({
  children,
  shadow = true,
  background = true,
  borderTop,
  padding,
  marginBottom,
  title,
  contentHeight,
  description,
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

  if (marginBottom) {
    classList.push('m-b-25');
  }

  if (description) {
    classList.push('position-relative');
  }

  return (
    <div className={classList.join(' ')}>
      {title && (
        <div className="p-b-10">
          <strong>{title}</strong>
        </div>
      )}
      {description && <DescriptionIcon description={description} />}
      <div style={contentHeight ? { height: contentHeight } : undefined}>{children}</div>
    </div>
  );
};
