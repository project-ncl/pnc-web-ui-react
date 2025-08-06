import { ContentBox } from 'components/ContentBox/ContentBox';
import { PageSectionHeader } from 'components/PageSectionHeader/PageSectionHeader';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { ToolbarItem } from 'components/Toolbar/ToolbarItem';

interface IDashboardWidget {
  title: string;
  src: string;
}

/**
 * Dashboard widget component for iframe widgets.
 *
 * @param title - The title of the widget
 * @param src - The source url of the iframe widget
 *
 * @example
 * ```tsx
 * <DashboardWidget title="Demo Title" src="https://test.url.example"></DashboardWidget>
 * ```
 *
 */

const cardBodyStyles = { width: '100%', height: '250px' };

export const DashboardWidget = ({ title, src }: IDashboardWidget) => (
  <>
    <Toolbar>
      <ToolbarItem>
        <PageSectionHeader title={title} />
      </ToolbarItem>
    </Toolbar>
    <ContentBox>
      <iframe src={src} title={title} style={cardBodyStyles}></iframe>
    </ContentBox>
  </>
);
