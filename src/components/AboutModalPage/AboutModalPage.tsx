import { AboutModal, TextContent, TextList, TextListItem } from '@patternfly/react-core';
import pncLogoText from '../../pnc-logo-text.svg';

export interface AboutModalPageProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AboutModalPage = (props: AboutModalPageProps) => {
  const pncRepositoryUrl = 'https://github.com/project-ncl/pnc';
  const pncWebUiRepositoryUrl = 'https://github.com/project-ncl/pnc-web-ui-react';

  return (
    <>
      <AboutModal
        isOpen={props.isOpen}
        onClose={props.onClose}
        trademark="Red Hat, Inc. © 2021"
        brandImageSrc={pncLogoText}
        brandImageAlt="PNC Logo"
      >
        <TextContent>
          <TextList component="dl">
            <TextListItem component="dt">
              <a href={pncRepositoryUrl}>PNC System Version</a>
            </TextListItem>
            <TextListItem component="dd">master</TextListItem>
            <TextListItem component="dt">
              <a href={pncWebUiRepositoryUrl}>PNC Web UI Version</a>
            </TextListItem>
            <TextListItem component="dd">1.1.1-SNAPSHOT 27 July 2021 Rev: b46a170</TextListItem>
          </TextList>
        </TextContent>
      </AboutModal>
    </>
  );
};
