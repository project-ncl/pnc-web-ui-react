import { CubesIcon } from '@patternfly/react-icons';
import { Link } from 'react-router';

import { PageTitles } from 'common/constants';

import { PageLayout } from 'components/PageLayout/PageLayout';
import { StateCard } from 'components/StateCard/StateCard';

import '../../index.css';

interface IErrorPageProps {
  pageTitle: string;
  errorDescription: React.ReactNode;
}

export const ErrorPage = ({ pageTitle, errorDescription }: IErrorPageProps) => {
  return (
    <PageLayout title={pageTitle}>
      <StateCard
        title={pageTitle !== PageTitles.pageNotFound ? `Error when loading ${pageTitle}` : '404: Page does not exist'}
        icon={CubesIcon}
      >
        <div>{errorDescription}</div>
        <Link className="m-t-15 pf-v5-c-button pf-m-primary" to="/">
          Return to Dashboard
        </Link>
      </StateCard>
    </PageLayout>
  );
};
