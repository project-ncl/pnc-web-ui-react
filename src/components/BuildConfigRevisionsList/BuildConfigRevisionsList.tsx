import { Tab, TabTitleText, Tabs } from '@patternfly/react-core';
import { useLocation, useNavigate } from 'react-router-dom';

import { BuildConfigRevisionPage } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';

import { IServiceContainerState } from 'hooks/useServiceContainer';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Username } from 'components/Username/Username';

import styles from './BuildConfigRevisionsList.module.css';

interface IBuildConfigRevisionsListProps {
  serviceContainerBuildConfigRevisions: IServiceContainerState<BuildConfigRevisionPage>;
  selectedRevision?: string;
  componentId: string;
}
/**
 * Component displaying Build Config Revisions.
 *
 * @param serviceContainerBuildConfigRevisions - Service Container for Build Config Revisions
 * @param selectedRevision - The selected Build Config Revision ID
 * @param componentId - Component ID
 */
export const BuildConfigRevisionsList = ({
  serviceContainerBuildConfigRevisions,
  selectedRevision,
  componentId,
}: IBuildConfigRevisionsListProps) => {
  const navigate = useNavigate();
  const { search } = useLocation();

  return (
    <>
      <ContentBox borderBottom>
        <ServiceContainerLoading {...serviceContainerBuildConfigRevisions} title={PageTitles.buildConfigRevision}>
          <Tabs activeKey={selectedRevision} isVertical isSecondary className={styles['responsive-tab']}>
            {serviceContainerBuildConfigRevisions.data?.content?.map((buildConfigRevision, rowIndex) => (
              <Tab
                eventKey={String(buildConfigRevision.rev)}
                key={rowIndex}
                onClick={() => {
                  navigate(`/build-configs/${buildConfigRevision.id}/revisions/${buildConfigRevision.rev}${search}`);
                }}
                title={
                  <TabTitleText>
                    {!buildConfigRevision.modificationTime && <>Revision #{buildConfigRevision.rev}</>}
                    {buildConfigRevision.modificationTime && <DateTime date={buildConfigRevision.modificationTime} displayTime />}
                    {buildConfigRevision.modificationUser?.username && (
                      <>
                        {' '}
                        by{' '}
                        <b>
                          <Username text={buildConfigRevision.modificationUser.username} />
                        </b>
                      </>
                    )}
                  </TabTitleText>
                }
              />
            ))}
          </Tabs>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination
        componentId={componentId}
        count={serviceContainerBuildConfigRevisions.data?.totalHits}
        pageSizeDefault="page15"
        isCompact
      />
    </>
  );
};
