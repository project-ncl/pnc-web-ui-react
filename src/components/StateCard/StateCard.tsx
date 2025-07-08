import { EmptyState, EmptyStateBody } from '@patternfly/react-core';

interface IStateCard {
  children?: React.ReactNode;
  title: string;
  icon: any;
}

/**
 * Generalized state card component. Usually this component is not used directly, mostly only
 * specific components like {@link LoadingStateCard}, {@link ErrorStateCard} and {@link EmptyStateCard}
 * will use it.
 *
 * @param children - Body content
 * @param title - Card title
 * @param icon - Icon representing state
 */
export const StateCard = ({ children, title, icon }: React.PropsWithChildren<IStateCard>) => (
  <EmptyState headingLevel="h4" icon={icon} titleText={title} isFullHeight>
    <EmptyStateBody>{children}</EmptyStateBody>
  </EmptyState>
);
