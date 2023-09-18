import { MESSAGE_PNC_ADMIN_CONTACT, MESSAGE_WAIT_AND_REFRESH } from 'common/constants';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { ErrorPage } from 'components/ErrorPage/ErrorPage';
import { PageLayout } from 'components/PageLayout/PageLayout';

import { keycloakService } from 'services/keycloakService';
import * as webConfigService from 'services/webConfigService';

const webConfig = webConfigService.getWebConfig();

interface IKeycloakStatusPageProps {
  // Text that will be used when constructing page title
  title: string;

  // Whether page content should be presented as error (page could not be displayed due to Keycloak), or it's just status page
  displayAsError: boolean;
}

/**
 * This page can be displayed in two different contexts:
 *  1) Status page:
 *    a) Keycloak service is available
 *    b) Keycloak service is NOT available
 *  2) Error page - requested page (for example projects/create) could not be displayed due to Keycloak
 */
export const KeycloakStatusPage = ({ title, displayAsError }: IKeycloakStatusPageProps) => {
  const content = (
    <>
      {webConfig.keycloak.url.startsWith('http') ? (
        <>
          If Keycloak is not available, then login and operations requiring authorization are deactivated.
          <br />
          <br />
          <ul>
            <li>
              - Try to open{' '}
              <a href={webConfig.keycloak.url} target="_blank" rel="noreferrer">
                {webConfig.keycloak.url}
              </a>{' '}
              <br />
              directly, if there is an error, check your network, vpn and certificates are configured correctly
            </li>
            <li>- {MESSAGE_WAIT_AND_REFRESH}</li>
          </ul>
          <br />
        </>
      ) : null}
      If the error still persists please contact {MESSAGE_PNC_ADMIN_CONTACT}.
    </>
  );

  // Error page - requested page (for example projects/create) could not be displayed due to Keycloak
  if (!keycloakService.isKeycloakAvailable) {
    return displayAsError ? (
      <ErrorPage
        pageTitle={title}
        errorDescription={
          <>
            <b>Keycloak service is not available.</b>
            <br />
            <br />
            {content}
          </>
        }
      />
    ) : (
      // Status page - Keycloak service is NOT available
      <PageLayout title={`${title} is not available`}>
        <ContentBox padding isResponsive>
          {content}
        </ContentBox>
      </PageLayout>
    );
  }

  // Status page - Keycloak service is available
  return (
    <PageLayout title={`Keycloak service is successfully initialized`}>
      <ContentBox padding isResponsive>
        <b>
          Keycloak service is available and successfully initialized, if you still have login issues, try to proceed steps below.
        </b>
        <br />
        <br />
        {content}
      </ContentBox>
    </PageLayout>
  );
};
