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

/**
 * ContentBox component containing contents with general style control.
 *
 * @param children - Body content, for example tables
 * @param title - Section title, for example "Projects"
 * @param description - Section description containing brief page introduction and information about displayed entities
 * @param shadow - Whether to display shadow
 * @param background - Whether to display background
 * @param borderTop - Whether to display border on the top 
 * @param padding - Whether to set padding
 * @param paddingTop - Whether to set padding-top
 * @param paddingBottom - Whether to set padding-left
 * @param paddingLeft - Whether to set padding-left 
 * @param paddingRight - Whether to set padding-right 
 * @param marginTop - Whether to set margin-top
 * @param marginBottom - Whether to set margin-bottom
 * @param contentHeight - Set height of the content
 * @param isResponsive - Whether the content should have responsive width over different sizes of screens, ideal for displaying attributes and forms, not suggested for table contents.
 * 
 * @example
 * ```tsx
 * <ContentBox
      title="Projects"
      description={<>This section contains a standalone projects like <Label>Hibernate</Label></>}
    >
      <CustomBodyContent />
    </ContentBox>
 * ```
 * 
 */
export const ContentBox = ({
  children,
  title,
  description,
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
  contentHeight,
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
