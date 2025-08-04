import { Content } from '@patternfly/react-core';
import { ReactNode } from 'react';

interface IPageSectionHeaderProps {
  title: ReactNode;
  titleComponent?: 'h1' | 'h2';
  description?: ReactNode;
}

export const PageSectionHeader = ({ title, titleComponent = 'h2', description }: IPageSectionHeaderProps) => (
  <div>
    <Content component={titleComponent}>{title}</Content>
    {description && <Content component="p">{description}</Content>}
  </div>
);
