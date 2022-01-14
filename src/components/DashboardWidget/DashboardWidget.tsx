import { Card, CardBody, CardTitle } from '@patternfly/react-core';

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

export const DashboardWidget = ({ title, src }: IDashboardWidget) => {
  return (
    <Card isCompact>
      <CardTitle>{title}</CardTitle>
      <CardBody>
        <iframe src={src} style={{ width: '100%', height: '250px' }}></iframe>
      </CardBody>
    </Card>
  );
};
