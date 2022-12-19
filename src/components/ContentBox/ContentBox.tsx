import { PropsWithChildren } from 'react';

import styles from './ContentBox.module.css';

interface IContentBoxProps {
  shadow?: boolean;
  background?: boolean;
  borderTop?: boolean;
  padding?: boolean;
  marginBottom?: boolean;
  title?: string;
}

export const ContentBox = ({
  children,
  shadow = true,
  background = true,
  borderTop,
  padding,
  marginBottom,
  title,
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

  return (
    <div className={classList.join(' ')}>
      {title && (
        <div className="p-b-10">
          <strong>{title}</strong>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};
