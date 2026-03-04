import { MESSAGE_PNC_ADMIN_CONTACT } from 'common/constants';

import { useAuth } from 'hooks/useAuth';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { ErrorPage } from 'components/ErrorPage/ErrorPage';
import { PageLayout } from 'components/PageLayout/PageLayout';

interface IAuthServiceStatusPageProps {
  // If undefined, Auth Service status page will be rendered. Otherwise, the title will be used as the title of the error page that is rendered instead.
  errorPageTitle?: string;
}

/**
 * This page can be displayed in two different contexts:
 *  1) Status page:
 *    a) Auth Service service is available
 *    b) Auth Service service is NOT available
 *  2) Error page - requested page (for example projects/create) could not be displayed due to Auth Service failure
 */
export const AuthServiceStatusPage = ({ errorPageTitle }: IAuthServiceStatusPageProps) => {
  const auth = useAuth();

  const content = <>TODO... If the error still persists please contact {MESSAGE_PNC_ADMIN_CONTACT}.</>;

  if (auth.isError) {
    return errorPageTitle ? (
      // Error page - requested page (for example projects/create) could not be displayed due to Auth Service failure
      <ErrorPage
        pageTitle={errorPageTitle}
        errorDescription={
          <>
            <b>OIDC Auth Service is not available.</b>
            <br />
            <br />
            {content}
          </>
        }
      />
    ) : (
      // Status page - Auth Service is NOT available
      <PageLayout title="OIDC Auth service is not available">
        <ContentBox padding isResponsive>
          {content}
        </ContentBox>
      </PageLayout>
    );
  }

  // Status page - Auth Service service is available
  return (
    <PageLayout title="OIDC Auth service is successfully initialized">
      <ContentBox padding isResponsive>
        <b>
          OIDC Auth Service is available and successfully initialized, if you still have login issues, try to follow the steps
          below.
        </b>
        <br />
        <br />
        {content}
      </ContentBox>
    </PageLayout>
  );
};
