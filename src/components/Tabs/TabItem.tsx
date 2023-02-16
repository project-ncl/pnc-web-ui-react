import { Tab as TabPF, TabTitleText } from '@patternfly/react-core';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

interface ITabItem {
  url: string;
  index?: number;
}

export const TabItem = ({ children, url, index }: PropsWithChildren<ITabItem>) => {
  const navigate = useNavigate();

  return <TabPF title={<TabTitleText>{children}</TabTitleText>} onClick={() => navigate(url)} eventKey={index || 0} />;
};
