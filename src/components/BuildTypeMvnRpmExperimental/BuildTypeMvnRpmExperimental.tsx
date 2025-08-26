import { Icon } from '@patternfly/react-core';
import { ExclamationTriangleIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';

import { buildTypeData } from 'common/buildTypeData';

import { TooltipWrapper } from 'components/TooltipWrapper/TooltipWrapper';

import * as webConfigService from 'services/webConfigService';

export const BuildTypeMvnRpmExperimentalIcon = () => {
  return (
    <Icon status="warning">
      <ExclamationTriangleIcon />
    </Icon>
  );
};

export const BuildTypeMvnRpmExperimentalDescription = () => {
  const webConfig = webConfigService.getWebConfig();

  return (
    <>
      {buildTypeData.MVN_RPM.id} feature is experimental. Feedback is being collected to evaluate and improve it. You may create a
      new&nbsp;&nbsp;
      <a href={webConfig.userGuideUrl} target="_blank" rel="noopener noreferrer">
        feature request <ExternalLinkAltIcon />
      </a>
      &nbsp;&nbsp;or contact&nbsp;&nbsp;
      <a href={webConfig.userSupportUrl} target="_blank" rel="noopener noreferrer">
        user's support <ExternalLinkAltIcon />
      </a>
    </>
  );
};

export const BuildTypeMvnRpmExperimentalTooltip = () => {
  return (
    <span className="p-l-5">
      <TooltipWrapper tooltip={<BuildTypeMvnRpmExperimentalDescription />}>
        <BuildTypeMvnRpmExperimentalIcon />
      </TooltipWrapper>
    </span>
  );
};
