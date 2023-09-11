import {
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerPanelBody,
  DrawerPanelContent,
  DrawerPanelContentProps,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { PropsWithChildren, useEffect, useState } from 'react';

import { useWindowSizeObserver } from 'hooks/useWindowSizeObserver';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

// threshold when inline version of sidebar is toggled
const WINDOW_WIDTH_THRESHOLD_PX = 1000;

const sidebarContentWidth: DrawerPanelContentProps['widths'] = { default: 'width_33' };

interface IPageWithSidebarProps {
  sidebarTitle: string;
  sidebarContent: React.ReactNode;
  isExpanded: boolean;
  onExpand: (isExpanded: boolean) => void;
}

/**
 * Component rendering page with a side bar.
 *
 * @param sidebarTitle - Title of the sidebar
 * @param sidebarContent - Content of the sidebar
 * @param isExpanded - Whether the sidebar is expanded
 * @param onExpand - Function to toggle expand state of the sidebar
 * @param children - Page content
 */
export const PageWithSidebar = ({
  sidebarTitle,
  sidebarContent,
  isExpanded,
  onExpand,
  children,
}: PropsWithChildren<IPageWithSidebarProps>) => {
  const { windowWidth } = useWindowSizeObserver();
  const [conditionMet, setConditionMet] = useState<boolean>(false);

  useEffect(() => {
    if (windowWidth > WINDOW_WIDTH_THRESHOLD_PX && !conditionMet) {
      onExpand(true);
      setConditionMet(true);
    }

    if (windowWidth <= WINDOW_WIDTH_THRESHOLD_PX && conditionMet) {
      onExpand(false);
      setConditionMet(false);
    }
  }, [windowWidth, conditionMet, onExpand]);

  const panelContent = (
    <DrawerPanelContent isResizable widths={sidebarContentWidth}>
      <DrawerPanelBody hasNoPadding>
        <Toolbar>
          <ToolbarItem>
            <TextContent>
              <Text component={TextVariants.h2}>{sidebarTitle}</Text>
            </TextContent>
          </ToolbarItem>
          <ToolbarItem alignRight>
            <DrawerActions>
              <DrawerCloseButton
                onClick={() => {
                  onExpand(false);
                }}
              />
            </DrawerActions>
          </ToolbarItem>
        </Toolbar>
        <ContentBox shadow={false} borderTop>
          {sidebarContent}
        </ContentBox>
      </DrawerPanelBody>
    </DrawerPanelContent>
  );

  return (
    <Drawer isExpanded={isExpanded} isInline={windowWidth > WINDOW_WIDTH_THRESHOLD_PX}>
      <DrawerContent panelContent={panelContent}>{children}</DrawerContent>
    </Drawer>
  );
};
