import { EmptyState, EmptyStateBody, Icon } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import { ContentBox } from 'components/ContentBox/ContentBox';

import { uiLogger } from 'services/uiLogger';

interface IOldUiContentLinkBoxProps {
  contentTitle: string;
  route: string;
}

export const OldUiContentLinkBox = ({ contentTitle, route }: IOldUiContentLinkBoxProps) => {
  const baseUrl = process.env.REACT_APP_PNC_OLD_UI_WEB || '';

  if (!baseUrl) {
    const errorMessage = 'process.env.REACT_APP_PNC_OLD_UI_WEB must be defined: ' + process.env.REACT_APP_PNC_OLD_UI_WEB;
    uiLogger.error(errorMessage);
    throw new Error(errorMessage);
  }

  return (
    <ContentBox>
      <EmptyState variant="small">
        <div> To display {contentTitle}, visit:</div>
        <EmptyStateBody>
          <div>
            <a href={`${baseUrl}/${route}`} target="_blank" rel="noreferrer">
              <Icon size="md">
                <ExternalLinkAltIcon />
              </Icon>{' '}
              {new URL(baseUrl).hostname}
            </a>
          </div>
          <div>Feature coming soon</div>
        </EmptyStateBody>
      </EmptyState>
    </ContentBox>
  );
};
