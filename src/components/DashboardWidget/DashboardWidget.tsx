import { ContentBox } from 'components/ContentBox/ContentBox';

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
  <ContentBox padding title={title}>
    <iframe src={src} title={title} style={cardBodyStyles}></iframe>
  </ContentBox>
);
