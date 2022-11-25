import { CubesIcon } from '@patternfly/react-icons';
import { PageTitles } from 'constants';
import { Link } from 'react-router-dom';

import { StateCard } from 'components/EmptyStates/StateCard';
import { PageLayout } from 'components/PageLayout/PageLayout';

import '../../index.css';

interface IErrorPageProps {
  pageTitle: string;
  errorDescription: string;
}

export const ErrorPage = ({ pageTitle, errorDescription }: IErrorPageProps) => {
  return (
    <PageLayout title={pageTitle}>
      <StateCard
        title={pageTitle !== PageTitles.pageNotFound ? `Error when loading ${pageTitle}` : '404: Page does not exist'}
        icon={CubesIcon}
      >
        <pre>{errorDescription}</pre>
        <Link className="m-t-15 pf-c-button pf-m-primary" to="/">
          Return to Dashboard
        </Link>
      </StateCard>
    </PageLayout>
  );
};
