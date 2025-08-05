import { Card, CardBody, CardTitle } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { PropsWithChildren } from 'react';

import { BoxDescription, IDescription } from 'components/BoxDescription/BoxDescription';

import styles from './ContentBox.module.css';

interface IContentBoxProps {
  title?: string;
  description?: IDescription;
  padding?: boolean;
  border?: boolean;
  marginTop?: boolean;
  marginBottom?: boolean;
  contentBoxHeight?: string;
  isResponsive?: boolean;
}

/**
 * ContentBox component containing contents with general style control.
 *
 * @param children - Body content, for example tables
 * @param title - Section title, for example "Projects"
 * @param description - Section description containing brief content introduction and information about displayed entities (displayed as tooltip icon)
 * @param padding - Whether to set padding (inside border)
 * @param border - Whether to display border around the box
 * @param marginTop - Whether to set margin above the box (above border)
 * @param marginBottom - Whether to set margin below the box (below border)
 * @param contentBoxHeight - Set height of the content box (margin not included)
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
  padding,
  border = true,
  marginTop,
  marginBottom,
  contentBoxHeight,
  isResponsive,
}: PropsWithChildren<IContentBoxProps>) => {
  return (
    <Card
      isPlain={!border}
      className={css(
        styles['content-box'],
        marginTop && 'm-t-global',
        marginBottom && 'm-b-global',
        isResponsive && styles['content-box--responsive-content']
      )}
      style={contentBoxHeight ? { height: contentBoxHeight } : undefined}
    >
      {title && (
        <CardTitle>
          <strong>{title}</strong>
        </CardTitle>
      )}
      {description && <BoxDescription description={description} />}
      {padding ? <CardBody>{children}</CardBody> : children}
    </Card>
  );
};
