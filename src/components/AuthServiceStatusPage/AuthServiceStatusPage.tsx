import { MESSAGE_PNC_ADMIN_CONTACT, MESSAGE_WAIT_AND_REFRESH } from 'common/constants';

import { useAuth } from 'hooks/useAuth';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { ErrorPage } from 'components/ErrorPage/ErrorPage';
import { PageLayout } from 'components/PageLayout/PageLayout';

import * as webConfigService from 'services/webConfigService';

const webConfig = webConfigService.getWebConfig();

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

  const content = (
    <>
      {webConfig.keycloak.url.startsWith('http') ? (
        <>
          If Auth Service is not available, then login and operations requiring authorization are deactivated.
          <br />
          <br />
          <ul>
            <li>
              - Try to open{' '}
              <a href={webConfig.keycloak.url} target="_blank" rel="noreferrer">
                {webConfig.keycloak.url}
              </a>{' '}
              <br />
              directly; if there is an error, check whether your network, VPN and certificates are configured correctly
            </li>
            <li>- {MESSAGE_WAIT_AND_REFRESH}</li>
          </ul>
          <br />
        </>
      ) : null}
      If the error still persists please contact {MESSAGE_PNC_ADMIN_CONTACT}.
    </>
  );

  if (auth.isError) {
    return errorPageTitle ? (
      // Error page - requested page (for example projects/create) could not be displayed due to Auth Service failure
      <ErrorPage
        pageTitle={errorPageTitle}
        errorDescription={
          <>
            <b>Auth Service is not available: {auth.error}</b>
            <br />
            <br />
            {content}
          </>
        }
      />
    ) : (
      // Status page - Auth Service is NOT available
      <PageLayout title="Auth Service is not available">
        <ContentBox padding isResponsive>
          <b>Auth Service is not available: {auth.error}</b>
          <br />
          <br />
          {content}
        </ContentBox>
      </PageLayout>
    );
  }

  // Status page - Auth Service service is available
  return (
    <PageLayout title="Auth Service is successfully initialized">
      <ContentBox padding isResponsive>
        <b>
          Auth Service is available and successfully initialized, but if you still have login issues, try to follow the steps
          below.
        </b>
        <br />
        <br />
        {content}
      </ContentBox>
    </PageLayout>
  );
};
