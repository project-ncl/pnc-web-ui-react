import { useEffect } from 'react';

import { DeliverableAnalyzerOperation } from 'pnc-api-types-ts';

import { PageTitles } from 'common/constants';
import { deliverablesAnalysisEntityAttributes } from 'common/deliverablesAnalysisEntityAttributes';

import { useParamsRequired } from 'hooks/useParamsRequired';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { Attributes } from 'components/Attributes/Attributes';
import { AttributesItem } from 'components/Attributes/AttributesItem';
import { ContentBox } from 'components/ContentBox/ContentBox';
import { DateTime } from 'components/DateTime/DateTime';
import { DeliverablesAnalysisProgressStatusLabelMapper } from 'components/LabelMapper/DeliverablesAnalysisProgressStatusLabelMapper';
import { DeliverablesAnalysisResultLabelMapper } from 'components/LabelMapper/DeliverablesAnalysisResultLabelMapper';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ServiceContainerLoading } from 'components/ServiceContainers/ServiceContainerLoading';

import * as operationsApi from 'services/operationsApi';

import { generatePageTitle } from 'utils/titleHelper';

export const DeliverablesAnalysisDetailPage = () => {
  const { deliverablesAnalysisId } = useParamsRequired();

  const serviceContainerDeliverablesAnalysis = useServiceContainer(operationsApi.getDeliverablesAnalysis);
  const serviceContainerDeliverablesAnalysisRunner = serviceContainerDeliverablesAnalysis.run;

  const deliverablesAnalysis: DeliverableAnalyzerOperation | undefined = serviceContainerDeliverablesAnalysis.data || undefined;

  useEffect(() => {
    serviceContainerDeliverablesAnalysisRunner({
      serviceData: { id: deliverablesAnalysisId },
    });
  }, [serviceContainerDeliverablesAnalysisRunner, deliverablesAnalysisId]);

  useTitle(
    generatePageTitle({
      serviceContainer: serviceContainerDeliverablesAnalysis,
      firstLevelEntity: 'Product',
      nestedEntity: 'Deliverables Analysis',
      entityName:
        `Deliverables Analysis ${deliverablesAnalysis?.id}` +
        (deliverablesAnalysis?.productMilestone
          ? ` ${PageTitles.delimiterSymbol} ${deliverablesAnalysis?.productMilestone.version} ${PageTitles.delimiterSymbol} <unknown>`
          : ''),
    })
  );

  return (
    <ServiceContainerLoading {...serviceContainerDeliverablesAnalysis} title="Deliverables Analysis details">
      <PageLayout title="Deliverables Analysis details">
        <ContentBox padding marginBottom isResponsive>
          <Attributes>
            <AttributesItem title={deliverablesAnalysisEntityAttributes.id.title}>{deliverablesAnalysis?.id}</AttributesItem>
            <AttributesItem title={deliverablesAnalysisEntityAttributes['user.username'].title}>
              {deliverablesAnalysis?.user?.username}
            </AttributesItem>
            <AttributesItem title={deliverablesAnalysisEntityAttributes.progressStatus.title}>
              {deliverablesAnalysis?.progressStatus && (
                <DeliverablesAnalysisProgressStatusLabelMapper progressStatus={deliverablesAnalysis.progressStatus} />
              )}
            </AttributesItem>
            <AttributesItem title={deliverablesAnalysisEntityAttributes.result.title}>
              {deliverablesAnalysis?.result && <DeliverablesAnalysisResultLabelMapper result={deliverablesAnalysis.result} />}
            </AttributesItem>
            <AttributesItem title={deliverablesAnalysisEntityAttributes.submitTime.title}>
              {deliverablesAnalysis?.submitTime && <DateTime date={deliverablesAnalysis.submitTime} />}
            </AttributesItem>
            <AttributesItem title={deliverablesAnalysisEntityAttributes.startTime.title}>
              {deliverablesAnalysis?.startTime && <DateTime date={deliverablesAnalysis.startTime} />}
            </AttributesItem>
            <AttributesItem title={deliverablesAnalysisEntityAttributes.endTime.title}>
              {deliverablesAnalysis?.endTime && <DateTime date={deliverablesAnalysis.endTime} />}
            </AttributesItem>
            <AttributesItem title={deliverablesAnalysisEntityAttributes.parameters.title}>
              {deliverablesAnalysis?.parameters &&
                Object.values(deliverablesAnalysis.parameters).map((parameter, index) => <div key={index}>{parameter}</div>)}
            </AttributesItem>
          </Attributes>
        </ContentBox>

        {/* TODO: Log*/}
      </PageLayout>
    </ServiceContainerLoading>
  );
};
