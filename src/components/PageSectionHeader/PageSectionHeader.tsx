import { Content } from '@patternfly/react-core';
import { ReactNode } from 'react';

interface IPageSectionHeaderProps {
  title: ReactNode;
  description?: ReactNode;
}

export const PageSectionHeader = ({ title, description }: IPageSectionHeaderProps) => (
  <Content>
    <Content component="h2">{title}</Content>
    {description && <Content component="p">{description}</Content>}
  </Content>
);
