import { TableComposable, Tbody, Td, Tr } from '@patternfly/react-table';
import { Link } from 'react-router-dom';

import { BuildConfigRevisionPage } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';

import { IServiceContainerState } from 'hooks/useServiceContainer';

import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { Pagination } from 'components/Pagination/Pagination';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';
import { Username } from 'components/Username/Username';

const revisionTableLinkStyle = { textDecoration: 'none' };

interface IBuildConfigRevisionsListProps {
  serviceContainerBuildConfigRevisions: IServiceContainerState<BuildConfigRevisionPage>;
  selectedRevision?: number;
  componentId?: string;
}
/**
 * Component displaying Build Config Revisions List.
 *
 * @param serviceContainerBuildConfigRevisions - Service Container for Build Config Revisions
 * @param selectedRevision - The revision ID of the Revision that selected
 * @param componentId - Component ID
 */
export const BuildConfigRevisionsList = ({
  serviceContainerBuildConfigRevisions,
  selectedRevision,
  componentId = 'br1',
}: IBuildConfigRevisionsListProps) => {
  return (
    <>
      <ContentBox borderTop>
        <ServiceContainerLoading {...serviceContainerBuildConfigRevisions} title={PageTitles.buildConfigRevision}>
          <TableComposable variant="compact" hasSelectableRowCaption>
            <Tbody>
              {serviceContainerBuildConfigRevisions.data?.content?.map((buildConfigRevision, rowIndex) => (
                <Tr
                  key={rowIndex}
                  isSelectable
                  isHoverable
                  isRowSelected={selectedRevision === buildConfigRevision.rev || (!selectedRevision && rowIndex === 0)}
                >
                  <Link
                    style={revisionTableLinkStyle}
                    to={
                      selectedRevision === buildConfigRevision.rev
                        ? ''
                        : `/build-configs/${buildConfigRevision.id}/revisions/${buildConfigRevision.rev}`
                    }
                  >
                    <Td>
                      {buildConfigRevision.modificationTime && (
                        <DateTime date={buildConfigRevision.modificationTime} displayTime />
                      )}
                      {buildConfigRevision.modificationUser?.username && (
                        <>
                          {' '}
                          by{' '}
                          <b>
                            <Username text={buildConfigRevision.modificationUser.username} />
                          </b>
                        </>
                      )}
                    </Td>
                  </Link>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </ServiceContainerLoading>
      </ContentBox>

      <Pagination
        componentId={componentId}
        count={serviceContainerBuildConfigRevisions.data?.totalHits}
        pageSizeDefault="page15"
      />
    </>
  );
};
