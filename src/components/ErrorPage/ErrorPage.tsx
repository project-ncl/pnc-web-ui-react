import { CubesIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';

import { PageTitles } from '../../utils/PageTitles';

import '../../index.css';
import { StateCard } from '../EmptyStates/StateCard';
import { PageLayout } from '../PageLayout/PageLayout';

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
