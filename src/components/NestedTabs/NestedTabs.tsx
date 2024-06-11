import { Tabs, TabsProps } from '@patternfly/react-core';

interface INestedTabsProps {
  activeTabKey: number;
  onTabSelect: (tabKey: INestedTabsProps['activeTabKey']) => void;
  children: TabsProps['children'];
}

/**
 * Component displaying list of tabs of a section of a page.
 * Each tab represents a different view of the page section.
 *
 * The component only changes activeTabKey. Based on the active key, different section views can be conditionally rendered, but this is not handled by this component.
 *
 * @param activeTabKey - Key / index of the tab item currently active
 * @param onTabSelect - On tab item selection callback
 * @param children - Tab item components
 */
export const NestedTabs = ({ activeTabKey, onTabSelect, children }: INestedTabsProps) => (
  <Tabs activeKey={activeTabKey} onSelect={(_, tabIndex) => onTabSelect(Number(tabIndex))} isBox>
    {children}
  </Tabs>
);
